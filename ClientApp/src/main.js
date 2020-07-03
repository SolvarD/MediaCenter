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

ipcMain.on('list-serie', function (event, path) {
  let listSerie = getNode(0, path);
  mainWindow.webContents.send('list-serie', listSerie);
});

function getNode(level = 0, path) {
  let listSerie = [];

  fs.readdirSync(path).forEach(file => {
    let pathFile = path + '\\' + file;
    let isDirectory = fs.lstatSync(pathFile).isDirectory();

    //if (isDirectory) {
    //  listSerie = listSerie.concat(getFiles(level + 1, pathFile));
    //} else {
    listSerie.push({
      title: file,
      path: pathFile,
      isDirectory: isDirectory,
      level: isDirectory? (level + 1): level,
      children: []
    });
    //}

  });

  return listSerie;
};

ipcMain.on('list-serie-group', function (event, path) {
  console.log(path);
  let listSerie = getFilesTree(0, path);
  mainWindow.webContents.send('list-serie-group', listSerie);
});

function getFilesTree(level = 0, path) {
  let listSerie = [];

  fs.readdirSync(path).forEach(file => {
    let pathFile = path + '\\' + file;
    let isDirectory = fs.lstatSync(pathFile).isDirectory();

    if (isDirectory) {
      listSerie.push({
        title: file,
        path: pathFile,
        isDirectory: isDirectory,
        level: level,
        children: getFiles(level + 1, pathFile)
      });
    } else {
      listSerie.push({
        title: file,
        path: pathFile,
        isDirectory: isDirectory,
        level: level,
        children: []
      });
    }
  });

  return listSerie;
};

ipcMain.on('load-config', function () {
  fs.readFile('./src/config/config-media-center.json', { encoding: 'utf-8' }, function (err, data) {
    mainWindow.webContents.send('load-config', data);
  })
})
