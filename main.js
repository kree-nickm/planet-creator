"use strict";
const { app, BrowserWindow, Menu, MenuItem, dialog, ipcMain } = require('electron');
const fs = require('fs');
const DataManager = require('./DataManager.js');
const md = require('markdown-it')();

const database = new DataManager();
const appWindows = [];

app.whenReady().then(() => {
	createWindow();
	app.on("activate", function(){
		if(appWindows[0] === null)
			createWindow();
	});
}).catch(console.error);

app.on("window-all-closed", () => {
	if(process.platform !== "darwin")
		app.quit();
});

ipcMain.on("saveArticle", async (event, data) => {
	if(database.index)
	{
		if(await database.saveArticle(data, (data.id != "")))
		{
			sendArticles();
		}
	}
	else
	{
		showMessage({
			type: "error",
			title: "Failed to Save Article",
			message: "The database for your setting has not been loaded.",
		});
	}
});

ipcMain.on("loadArticle", async (event, findData) => {
	if(database.index)
	{
		let data;
		if(findData.id)
		{
			data = await database.loadArticle(findData.id)
			data.id = findData.id;
			let templates = {
				'*': {
					id: {
						type: "hidden",
						onlyIfSet: true,
					},
					title: {
						type: "text",
						description: "Article Title",
					},
					content: {
						type: "textarea",
						description: "Article Content",
						useMarkdown: true,
					},
				}
			};
			for(let t in templates)
			{
				for(let f in templates[t])
				{
					if(templates[t][f].useMarkdown && data[f])
					{
						data[f+":Markdown"] = md.render(data[f].replace(/\[\[(.*?)]]/g, (match,p1,offset,string) => {
							for(let i in database.index)
							{
								if(typeof(database.index[i].t) == "string" && database.index[i].t.toLowerCase() == p1.toLowerCase())
								{
									return "["+ p1 +"](#"+ i +")";
								}
							}
							return "["+ p1 +"](##"+ database.convertToID(p1) +")";
						}));
					}
				}
			}
		}
		else
			data = findData;
		appWindows[0].webContents.send("loadArticle", data);
	}
	else
	{
		showMessage({
			type: "error",
			title: "Failed to Load Article",
			message: "The database for your setting has not been loaded.",
		});
	}
});

function sendArticles()
{
	if(database.index && appWindows[0])
	{
		let articleList = [];
		for(let i in database.index)
		{
			let article = {};
			article.id = i;
			article.title = database.index[i].t;
			articleList.push(article);
		}
		appWindows[0].webContents.send("listArticles", articleList);
	}
	else
	{
		showMessage({
			type: "error",
			title: "Failed to Display Articles",
			message: "The database for your setting has not been loaded, or there is no GUI window loaded.",
		});
	}
}

async function showMessage(props)
{
	switch(props.type)
	{
		case "error":
			console.error(props);
			break;
		case "warning":
			console.warn(props);
			break;
		default:
			console.log(props);
	}
	if(appWindows[0])
		return await dialog.showMessageBox(appWindows[0], props);
	else
		return null;
}

async function createWindow()
{
	appWindows[0] = new BrowserWindow({
		width: 1500,
		height: 1050,
		webPreferences: {
			nodeIntegration: true,
			//preload: path.join(__dirname, 'preload.js')
		}
	});

	appWindows[0].loadFile("index.html");
	appWindows[0].on("closed", () => {
		for(let i in appWindows)
			appWindows[i] = null;
	});
	
	let menu = new Menu();
	
	let fileMenu = new MenuItem({
		label: "File",
		accelerator: "Alt+F",
		type: "submenu",
		submenu: new Menu(),
	});
	fileMenu.submenu.append(new MenuItem({
		label: "Open Setting...",
		accelerator: "CommandOrControl+O",
		type: "normal",
		click: async function(){
			let selection = await dialog.showOpenDialog(appWindows[0], {
				title: "Select Setting Directory...",
				properties: ["openDirectory","createDirectory","promptToCreate"],
			});
			if(!selection.canceled)
			{
				await database.init(selection.filePaths[0]);
				sendArticles();
			}
		},
	}));
	fileMenu.submenu.append(new MenuItem({
		label: "Open Map...",
		accelerator: "CommandOrControl+M",
		type: "normal",
		click: async function(){
			let selection = await dialog.showOpenDialog(appWindows[0], {
				title: "Open Map...",
				properties: ["openFile"],
				filters: [
					{name:"JSON", extensions:["json"]},
					{name:"All Files", extensions:["*"]},
				],
			});
			if(!selection.canceled)
			{
				try
				{
					let mapJSON = JSON.parse(await fs.promises.readFile(selection.filePaths[0]));
					if(mapJSON.coordinates && mapJSON.feetPerPixel && mapJSON.mapImages)
						appWindows[0].webContents.send("openMap", mapJSON);
					else
					{
						showMessage({
							type: "error",
							title: "Failed to Open Map",
							message: "The selected file is not a valid map.",
						});
					}
				}
				catch(err)
				{
					showMessage({
						type: "error",
						title: "Failed to Open Map",
						message: "The selected file is not a valid map.",
						detail: "The following error occurred when trying to open the file:\n" + err.toString(),
					});
				}
			}
		},
	}));
	fileMenu.submenu.append(new MenuItem({
		label: "Save Map As...",
		accelerator: "CommandOrControl+S",
		type: "normal",
		click: () => {appWindows[0].webContents.executeJavaScript("window.world.save('map');").then(console.log).catch(console.error);},
	}));
	fileMenu.submenu.append(new MenuItem({
		label: "Add Map Image...",
		accelerator: "CommandOrControl+A",
		type: "normal",
		click: async function(){
			let selection = await dialog.showOpenDialog(appWindows[0], {
				title: "Open Map Image...",
				properties: ["openFile","multiSelections"],
				filters: [
					{name:"Images", extensions:["jpg","jpeg","png","gif"]},
					{name:"All Files", extensions:["*"]},
				],
			});
			if(!selection.canceled)
			{
				try
				{
					appWindows[0].webContents.send("openMapImages", selection.filePaths);
				}
				catch(err)
				{
					dialog.showMessageBox(appWindows[0], {
						type: "error",
						title: "Failed to Open Image",
						message: "The selected file is not a valid image.",
						detail: "The following error occurred when trying to open the file:\n" + err.toString(),
					});
				}
			}
		},
	}));
	fileMenu.submenu.append(new MenuItem({
		label: "Exit",
		accelerator: "CommandOrControl+Q",
		type: "normal",
		click: () => {app.quit()},
	}));
	menu.append(fileMenu);
	
	let viewMenu = new MenuItem({
		label: "View",
		accelerator: "Alt+V",
		type: "submenu",
		submenu: new Menu(),
	});
	viewMenu.submenu.append(new MenuItem({
		label: "Articles",
		accelerator: "",
		type: "normal",
		click: () => {appWindows[0].webContents.send("setView", "articles");},
	}));
	viewMenu.submenu.append(new MenuItem({
		label: "Map",
		accelerator: "",
		type: "normal",
		click: () => {appWindows[0].webContents.send("setView", "map");},
	}));
	menu.append(viewMenu);
	
	let toolsMenu = new MenuItem({
		label: "Tools",
		accelerator: "Alt+T",
		type: "submenu",
		submenu: new Menu(),
	});
	toolsMenu.submenu.append(new MenuItem({
		label: "Dev Tools",
		accelerator: "CommandOrControl+Shift+I",
		type: "normal",
		click: () => {appWindows[0].webContents.openDevTools();},
	}));
	menu.append(toolsMenu);
	
	Menu.setApplicationMenu(menu);
}
