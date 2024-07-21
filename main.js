const { app, BrowserWindow, ipcMain, dialog } = require('electron/main')
const { exec, spawn } = require('child_process');
const path = require('node:path')

function createWindow() {
    const window = new BrowserWindow({
        width: 600,
        height: 500,
        icon: "assets/icon.png",
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    })

    window.loadFile('index.html')

    ipcMain.handle('run-command', async (event, command, args) => {
        return new Promise((resolve, reject) => {
            let cmd_str = path.join(process.resourcesPath, command);
            if (process.env.DEV) {
                cmd_str = 'exiftool'
            }
            const cmd = spawn(cmd_str, args);
            // Listen for stdout data
            cmd.stdout.on('data', (data) => {
                window.webContents.send('stdout-data', data.toString());
                console.log(`stdout: ${data}`);
            });
            
            // Listen for stderr data
            cmd.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
                reject();
            });
            
            // Listen for the child process to exit
            cmd.on('close', (code) => {
                resolve();
            });
        });
    });
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

ipcMain.handle('select-path', async (event) => {
    const result = await dialog.showOpenDialog(null, {
        properties: ['openDirectory', 'createDirectory']
    })
    return result.filePaths
});