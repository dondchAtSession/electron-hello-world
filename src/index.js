const { app, BrowserWindow } = require('electron');
const path = require('path');

    const exec = require('child_process').exec;

function execute(command, callback) {
    exec(command, (error, stdout, stderr) => { 
        callback(stdout); 
    });
};


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
//  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//app.on('ready', createWindow);

app.on('ready', () => {
    createWindow();
    require('update-electron-app')({
        // defaults to package.json
        updateInterval: '5 minutes',
        notifyUser: true,
        logger: require('electron-log')
    });

 console.log('process.resourcesPath: '+ process.resourcesPath);
 const badgeAppPath = path.join(process.resourcesPath, 'Session.Badge.Mac.app');
 console.log('badgeApp path: '+ badgeAppPath);
 const assistPath = path.join(process.resourcesPath, 'session.assist.app.zip');
 console.log('AssistApp path: '+ assistPath);


 //copy badge to destination
 execute('cp -rf '+badgeAppPath + ' ' + '/Library/Session.Studio/Badge/' , (output) => {
    console.log(output);
 });

//extract assist to destination
 execute('ditto -V -x -k --sequesterRsrc --rsrc '+assistPath + ' ' + '/Library/Session.Studio/Assist/' , (output) => {
    console.log(output);
 });



});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.




