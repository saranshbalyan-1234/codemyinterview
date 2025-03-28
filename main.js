const { app, BrowserWindow, globalShortcut } = require('electron');
const screenshot = require('screenshot-desktop');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

let win;

app.whenReady().then(() => {
  app.setName(' ');

  if (process.platform === 'darwin') {
    app.dock.hide();
  }

  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    focusable: false,
    fullscreenable: false,
    // titleBarStyle: 'hidden',
    // titleBarOverlay: false,
    show: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.setContentProtection(true);
  win.setIgnoreMouseEvents(true);
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

  globalShortcut.register('Command+8', () => {
    win.webContents.send('scroll-up');
  });

  globalShortcut.register('Command+9', () => {
    win.webContents.send('scroll-down');
  });

  globalShortcut.register('Command+0', () => {
    app.quit();
  });
  

  // Command+2 to take screenshot and upload
  globalShortcut.register('Command+1', () => {
    // const filePath = path.join(app.getPath('desktop'), `screenshot-${Date.now()}.jpg`);
    console.log("taking ss")
    screenshot({ format: 'jpg' }).then((img) => {
      // fs.writeFileSync(filePath, img);
      console.log("took ss");
      uploadToAI(img);
    }).catch((err) => {
      console.error('Screenshot failed:', err);
    });
  });
});

// Dummy AI upload simulation
function uploadToAI(img) {
  console.log("uploading ss");
  // const fileStream = fs.createReadStream(filePath);
  axios.post('https://httpbin.org/post', img, {
    headers: {
      'Content-Type': 'application/octet-stream'
    }
  }).then(res => {
    console.log('Uploaded to AI:', res.data);
    // document.getElementById('content').innerText = JSON.stringify(res.data);
    win.webContents.send('response', res.data ? JSON.stringify(res.data) : 'No response received');

  }).catch(err => {
    console.error('Upload failed:', err);
  });
}

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
