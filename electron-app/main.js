// pathname :path.join(__dirname,'mainWindow.html');
const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;


//SET ENVIRONMENT 
process.env.NODE_ENV = 'ENV';



let mainWindow;
let addWindow;

//Listen for app to be ready
app.on('ready', function(){
    //Create new Window
    mainWindow = new BrowserWindow({});

    //Load the html file into window
    mainWindow.loadURL(url.format({
        pathname : 'index.html',
        protocol: 'file',
        slashes :true
    }));

//Quit App when closed
mainWindow.on('closed', function(){
app.quit();

});


//Build menu from template
const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
//Insert menu
Menu.setApplicationMenu(mainMenu);
});

//Handle create Add Window
function createAddWindow(){
//Create new Window
    addWindow = new BrowserWindow({
        width: 300,
        height :200,
        title : 'Add Shopping List Items'
    });

    //Load the html file into window
    addWindow.loadURL(url.format({
        pathname : 'addWindow.html',
        protocol: 'file',
        slashes :true
    }));

    //Garbage collection handle
    addWindow.on('closed', function(){
        addWindow = null;
    });
}


//Catch item ;add
ipcMain.on('item:add', function(e, item){
    // console.log(item);
mainWindow.webContents.send('item:add', item);
addWindow.close();
});


//Create Menu Templates
const mainMenuTemplate = [
{
    label: 'File',
    submenu:[
        {
            label: 'Add Items',
            click(){
                createAddWindow();
            }
        },
        {
            label: 'Clear Items',
            click(){
               mainWindow.webContents.send('item:clear');
                
            }
        },
        {
            label : 'Quit',
            //use hot keys to quite with ternaly operators
            accelerator:process.platform == 'darwin' ? 'Command+Q' : 
            'ctrl+Q',
            click(){
                app.quit();
            }
        }
    ]   
},
{
    role: 'reload',
    accelerator: process.platform == 'darwin' ? 'F5' : 'F5'
  
}

];

//If Mac , add empty object to menu
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

//Add developer tools item if not in production
if (process.env.NODE_ENV !== 'production') 
{
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toogle DevTools',
                //use hot keys to quite with ternaly operators
            accelerator:process.platform == 'darwin' ? 'Command+I' : 
            'ctrl+I',
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