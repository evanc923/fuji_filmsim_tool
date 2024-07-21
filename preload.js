const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    selectPath: () => ipcRenderer.invoke('select-path'),
    runCommand: (command, args) => ipcRenderer.invoke('run-command', command, args),
    onStdoutData: (callback) => ipcRenderer.on('stdout-data', (event, data) => callback(data))
})

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})