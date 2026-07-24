const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let viteProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 900,
    minHeight: 600,
    title: 'Falcon Remote Client',
    frame: true,
    autoHideMenuBar: true,
    backgroundColor: '#0F172A',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const devUrl = 'http://localhost:5174';
  
  const load = () => {
    win.loadURL(devUrl).catch(() => {
      setTimeout(load, 400);
    });
  };
  load();
}

app.whenReady().then(() => {
  // Spawn Vite background process silently for Electron window
  viteProcess = spawn('npx.cmd', ['vite', '--port', '5174'], {
    cwd: __dirname,
    shell: true,
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (viteProcess) {
    try { viteProcess.kill(); } catch (e) {}
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
