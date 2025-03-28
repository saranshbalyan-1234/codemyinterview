const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const screenshot = require('screenshot-desktop');
const path = require('path');
const fs = require('fs');
const record = require('node-record-lpcm16');
const { imageAi,sendToChatGPTImage,sendToChatGPTAudio} = require('./ai');

let win;
let stealthMode = false;
let apiKey = '';
let recordingProcess = null;

app.whenReady().then(() => {
  const recordProgram = process.platform === 'win32' ? 'sox' : 'rec';
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
      // sendToChatGPTImage(base64Image,apiKey,win);
      imageAi(base64Image,apiKey,win)
    }).catch(err => {
      win.webContents.send('ai-response', 'Screenshot failed: ' + err.message);
    });
  });

  globalShortcut.register('Command+2', () => {
    if (!stealthMode) return;
  
    if (recordingProcess) {
      recordingProcess.stop();
      recordingProcess = null;
  
      // Send the in-memory buffer to ChatGPT
      const audioBuffer = Buffer.concat(audioChunks);
      sendToChatGPTAudio(audioBuffer, apiKey, win);
      win.webContents.send('ai-response', 'Voice recording stopped.');
    } else {
      audioChunks = [];
  
      recordingProcess = record.record({
        sampleRateHertz: 16000,
        threshold: 0.5,
        verbose: false,
        recordProgram,
        silence: '1.0',
      });
  
      const stream = recordingProcess.stream();
  
      stream.on('data', chunk => audioChunks.push(chunk));
      stream.on('error', err => {
        console.error('Recording stream error:', err);
        win.webContents.send('ai-response', 'Recording failed: ' + err.message);
      });
  
      win.webContents.send('ai-response', 'Voice recording started...');
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


app.on('will-quit', () => globalShortcut.unregisterAll());
