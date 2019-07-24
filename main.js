const { app, BrowserWindow, Menu, MenuItem, ipcMain } = require('electron');

let win;

function createWindow()
{
	win = new BrowserWindow({
		width: 1500,
		height: 1050,
		webPreferences: {
			nodeIntegration: true
		}
	});

	win.loadFile("index.html");
	//win.webContents.openDevTools();
	win.on("closed", () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		win = null;
	});
	
	var menu = new Menu();
	
	var fileMenu = new MenuItem({
		label: "File",
		accelerator: "Alt+F",
		type: "submenu",
		submenu: new Menu(),
	});
	fileMenu.submenu.append(new MenuItem({
		label: "Open...",
		accelerator: "CommandOrControl+O",
		type: "normal",
		click: () => {win.webContents.executeJavaScript("window.fileOpen();").then(console.log);},
	}));
	fileMenu.submenu.append(new MenuItem({
		label: "Save",
		accelerator: "CommandOrControl+S",
		type: "normal",
		click: () => {win.webContents.executeJavaScript("window.world.save('map');").then(console.log);},
	}));
	fileMenu.submenu.append(new MenuItem({
		label: "Add Image",
		accelerator: "CommandOrControl+A",
		type: "normal",
		click: () => {win.webContents.executeJavaScript("window.fileImageAdd();").then(console.log);},
	}));
	fileMenu.submenu.append(new MenuItem({
		label: "Exit",
		accelerator: "CommandOrControl+Q",
		type: "normal",
		click: () => {app.quit()},
	}));
	menu.append(fileMenu);
	
	var toolsMenu = new MenuItem({
		label: "Tools",
		accelerator: "Alt+T",
		type: "submenu",
		submenu: new Menu(),
	});
	toolsMenu.submenu.append(new MenuItem({
		label: "Dev Tools",
		accelerator: "CommandOrControl+Shift+I",
		type: "normal",
		click: () => {win.webContents.openDevTools();},
	}));
	menu.append(toolsMenu);
	
	menu.append(new MenuItem({
		label: "Move",
		type: "radio",
	}));
	
	Menu.setApplicationMenu(menu);
}

app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if(process.platform !== "darwin")
	{
		app.quit();
	}
});

app.on("activate", () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if(win === null)
	{
		createWindow();
	}
});
