const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 900,
    minHeight: 600,
    title: 'Falcon Remote Client',
    frame: true,
    titleBarStyle: 'default',
    backgroundColor: '#0F172A',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const devUrl = 'http://localhost:5174';
  win.loadURL(devUrl).catch(() => {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
