//https://www.techiediaries.com/angular-electron/

const { app, BrowserWindow, ipcMain } = require('electron')
const url = require("url");
const path = require("path");
const fs = require('fs');
let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1200,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(
    url.format({
      pathname: path.join(`./../dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})

ipcMain.on('list-serie', function () {
  let listSerie = [];
  fs.readdirSync('I:\Dark.Matter.S01.COMPLETE.FASTSUB.VOSTFR.720P.HDTV.X264-RUDY').forEach(file => {
    listSerie.push({
      title: file, path: 'I:\\Dark.Matter.S01.COMPLETE.FASTSUB.VOSTFR.720P.HDTV.X264-RUDY\\' + file
    });
  });

  mainWindow.webContents.send('list-serie', listSerie);
})
