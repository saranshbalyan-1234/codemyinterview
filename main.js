const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const screenshot = require('screenshot-desktop');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const record = require('node-record-lpcm16');
const FormData = require('form-data');

let win;
let stealthMode = false;
let apiKey = '';
let recordingProcess = null;

app.whenReady().then(() => {
  app.setName(' ');
  if (process.platform === 'darwin') app.dock.hide();

  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    focusable: true,
    fullscreenable: false,
    hasShadow: false,
    show: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  win.loadFile('index.html');

  const moveStep = 20;
  globalShortcut.register('Command+Left', () => {
    const { x, y } = win.getBounds();
    win.setBounds({ x: x - moveStep, y, width: 800, height: 600 });
  });
  globalShortcut.register('Command+Right', () => {
    const { x, y } = win.getBounds();
    win.setBounds({ x: x + moveStep, y, width: 800, height: 600 });
  });
  globalShortcut.register('Command+Up', () => {
    const { x, y } = win.getBounds();
    win.setBounds({ x, y: y - moveStep, width: 800, height: 600 });
  });
  globalShortcut.register('Command+Down', () => {
    const { x, y } = win.getBounds();
    win.setBounds({ x, y: y + moveStep, width: 800, height: 600 });
  });

  globalShortcut.register('Command+0', () => app.quit());

  globalShortcut.register('Command+1', () => {
    if (!stealthMode) return;
    screenshot({ format: 'png' }).then((img) => {
      const base64Image = img.toString('base64');
      sendToChatGPTImage(base64Image);
    }).catch(err => {
      win.webContents.send('ai-response', 'Screenshot failed: ' + err.message);
    });
  });

  globalShortcut.register('Command+2', () => {
    if (!stealthMode) return;
    if (recordingProcess) {
      recordingProcess.stop();
      recordingProcess = null;
      win.webContents.send('ai-response', 'Voice recording stopped.');
    } else {
      const filePath = path.join(app.getPath('temp'), `voice-${Date.now()}.wav`);
      recordingProcess = record.record({
        sampleRateHertz: 16000,
        threshold: 0.5,
        verbose: false,
        recordProgram: 'sox',
        silence: '1.0',
      }).stream().pipe(fs.createWriteStream(filePath));

      setTimeout(() => {
        if (recordingProcess) {
          recordingProcess.stop();
          recordingProcess = null;
          sendToChatGPTAudio(filePath);
        }
      }, 10000);
    }
  });

  globalShortcut.register('Command+8', () => win.webContents.send('scroll-up'));
  globalShortcut.register('Command+9', () => win.webContents.send('scroll-down'));
});

ipcMain.on('enter-stealth-mode', (_, key) => {
  apiKey = key;
  stealthMode = true;
  win.setIgnoreMouseEvents(true);
  win.setContentProtection(true);
});

function sendToChatGPTImage(base64Image) {
  const data = {
    model: 'gpt-4o',
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: 'What do you see in this image?' },
        {
          type: 'image_url',
          image_url: {
            url: `data:image/png;base64,${base64Image}`
          }
        }
      ]
    }],
    max_tokens: 1000
  };

  axios.post('https://api.openai.com/v1/chat/completions', data, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  }).then(res => {
    win.webContents.send('ai-response', res.data.choices[0].message.content);
  }).catch(err => {
    win.webContents.send('ai-response', 'OpenAI error: ' + (err.response?.data?.error?.message || err.message));
  });
}

function sendToChatGPTAudio(filePath) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));
  formData.append('model', 'whisper-1');

  axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
    headers: {
      ...formData.getHeaders(),
      'Authorization': `Bearer ${apiKey}`
    }
  }).then(res => {
    sendTextToChatGPT(res.data.text);
  }).catch(err => {
    win.webContents.send('ai-response', 'Whisper error: ' + (err.response?.data?.error?.message || err.message));
  });
}

function sendTextToChatGPT(prompt) {
  axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1000
  }, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  }).then(res => {
    win.webContents.send('ai-response', res.data.choices[0].message.content);
  }).catch(err => {
    win.webContents.send('ai-response', 'ChatGPT error: ' + (err.response?.data?.error?.message || err.message));
  });
}

app.on('will-quit', () => globalShortcut.unregisterAll());
