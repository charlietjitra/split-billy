import { app, BrowserWindow } from "electron";
import { createServer } from './app.js';

let mainWindow = null;

function main(){
    const { server, port } = createServer(); 

    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration:true,
        }
    });
    mainWindow.loadURL(`http://localhost:3000/`);
    mainWindow.on('close', event => {
        mainWindow = null;
    })
};

app.on('ready', main);
