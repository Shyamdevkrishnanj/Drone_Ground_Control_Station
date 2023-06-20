const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

// Set env
process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

// Listen for app to be ready
app.on('ready', function(){
    // Create new window
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        }
    });
    // Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    });

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert Menu
    Menu.setApplicationMenu(mainMenu);
});

// Handle create add window
function createAddWindow(){
    // Create new window
    addWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        title:'Flight Control'
    });
    // Load html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'flyingWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    // Garbage collection handle
    addWindow.on('close', function(){
        addWindow = null;
    });

}

// Create menu template 
const mainMenuTemplate = [
    {
        label: 'Functions',
        submenu:[
            {
                label: 'Flying',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Planning'
            },
            {
                label: 'Setup'
            },
            {
                label: 'Flight Data'
            },
            {
                label: 'Support'
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' :
                'Ctrl+Q',
                click(){
                    app.quit();
                }
            }

        ]

    }
];

// If mac, add empty object to menu  
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}


// Add developer tools item if not in production
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' :
                'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }

        ]
    });
}