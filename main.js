const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const screenshot = require('screenshot-desktop');
const { imageAi } = require('./ai');
const path = require('path');

let win;
let stealthMode = false;
let language = '';
let model = '';
let isVisible = true;
const toggleKey = process.platform === 'darwin' ? 'Command' : 'Control';

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
    },
    icon: path.join(__dirname, 'assets', getPlatformIcon()), // 👇
  });

  win.loadFile('index.html');

  const moveStep = 20;
  globalShortcut.register(`${toggleKey}+Left`, () => {
    const { x, y } = win.getBounds();
    win.setBounds({ x: x - moveStep, y, width: 800, height: 600 });
  });
  globalShortcut.register(`${toggleKey}+Right`, () => {
    const { x, y } = win.getBounds();
    win.setBounds({ x: x + moveStep, y, width: 800, height: 600 });
  });
  globalShortcut.register(`${toggleKey}+Up`, () => {
    const { x, y } = win.getBounds();
    win.setBounds({ x, y: y - moveStep, width: 800, height: 600 });
  });
  globalShortcut.register(`${toggleKey}+Down`, () => {
    const { x, y } = win.getBounds();
    win.setBounds({ x, y: y + moveStep, width: 800, height: 600 });
  });

  globalShortcut.register(`${toggleKey}+0`, () => app.quit());

  globalShortcut.register(`${toggleKey}+1`, () => {
    if (!stealthMode) return;
    screenshot({ format: 'png' }).then((img) => {
      const base64Image = img.toString('base64');
      // sendToChatGPTImage(base64Image,apiKey,win);
      imageAi(base64Image,language,model,win)
    }).catch(err => {
      win.webContents.send('ai-response', 'Screenshot failed: ' + err.message);
    });
  });

  globalShortcut.register(`${toggleKey}+2`, () => {
    if (isVisible) {
      win.hide();
    } else {
      win.show();
    }
    isVisible = !isVisible;
  });

  globalShortcut.register(`${toggleKey}+8`, () => win.webContents.send('scroll-up'));
  globalShortcut.register(`${toggleKey}+9`, () => win.webContents.send('scroll-down'));
});

ipcMain.on('enter-stealth-mode', (_, lan,mod) => {
  language = lan;
  model = mod;
  stealthMode = true;
  win.setIgnoreMouseEvents(true);
  win.setContentProtection(true);
});


app.on('will-quit', () => globalShortcut.unregisterAll());


function getPlatformIcon() {
  switch (process.platform) {
    case 'darwin': return 'icon.icns';
    case 'win32': return 'icon.ico';
    default: return 'icon.png';
  }
}