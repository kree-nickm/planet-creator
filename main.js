"use strict";
const { app, BrowserWindow, Menu, MenuItem, dialog, ipcMain } = require('electron');
const fs = require('fs');
const DataManager = require('./DataManager.js');
const md = require('markdown-it')();

const database = new DataManager();
const appWindows = [];
const prefs = {};

app.whenReady().then(async () => {
	let prefsTemp = await database.loadJSON("prefs.json");
	for(let i in prefsTemp)
		prefs[i] = prefsTemp[i];
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
		let id = data.id;
		if(await database.saveArticle(data, (id != "")))
		{
			sendArticles();
			ipcMain._events.loadArticle(event, {id:id});
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
			data = await database.loadArticle(findData.id);
		else
			data = findData;
		// Don't modify `data` past this point, since it might be a reference to the saved metadata object, which we may want to reuse in its original unmodified form.
		let categoryIDs;
		if(Array.isArray(data.categories))
			categoryIDs = ["*"].concat(data.categories);
		else
			categoryIDs = ["*"];
		let categories = {};
		let bonusData = {};
		for(let c in categoryIDs)
		{
			let categoryData = database.loadCategory(categoryIDs[c]);
			for(let f in categoryData.f)
			{
				if(categoryData.f[f].m && data[f])
				{
					bonusData[f+":Markdown"] = md.render(data[f].replace(/\[\[(.*?)]]/g, (match,p1,offset,string) => {
						if(database.index.articleIndex) for(let i in database.index.articleIndex)
						{
							if(typeof(database.index.articleIndex[i].t) == "string" && database.index.articleIndex[i].t.toLowerCase() == p1.toLowerCase())
							{
								return "["+ p1 +"](#"+ i +")";
							}
						}
						return "["+ p1 +"](##"+ database.convertToID(p1) +")";
					}));
				}
			}
			categories[categoryIDs[c]] = categoryData;
		}
		appWindows[0].webContents.send("loadArticle", (findData.id?findData.id:""), data, bonusData, categories);
		prefs.lastArticle = findData;
		database.saveJSON("prefs.json", prefs);
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

ipcMain.on("saveCategory", async (event, data) => {
	if(database.index)
	{
		let id = data.id;
		if(await database.saveCategory(data, (id != "")))
		{
			sendArticles();
			ipcMain._events.loadCategory(event, {id:id});
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

ipcMain.on("loadCategory", async (event, findData) => {
	if(database.index)
	{
		let data;
		if(findData.id)
			data = await database.loadCategory(findData.id)
		else
			data = findData;
		// Don't modify `data` past this point, since it might be a reference to the saved index object, which we do not want to arbitrarily modify.
		appWindows[0].webContents.send("loadCategory", (findData.id?findData.id:""), data);
		prefs.lastCategory = findData;
		database.saveJSON("prefs.json", prefs);
	}
	else
	{
		showMessage({
			type: "error",
			title: "Failed to Load Category",
			message: "The database for your setting has not been loaded.",
		});
	}
});

ipcMain.on("addArticleCategory", async (event, data) => {
	let category;
	for(let i in database.index.categoryIndex)
	{
		if(database.index.categoryIndex[i].t == data.categoryTitle || i == data.categoryTitle)
		{
			category = i;
		}
	}
	if(category)
	{
		let categories = Object.keys(data.categories);
		if(categories.indexOf(category) == -1)
		{
			categories.push(category);
			ipcMain._events.saveArticle(event, {
				id: data.article,
				categories: categories,
			});
		}
	}
});

function sendArticles()
{
	if(database.index && appWindows[0])
	{
		let list = {
			articles: [],
			categories: [],
		};
		if(database.index.articleIndex) for(let i in database.index.articleIndex)
		{
			let article = {};
			article.id = i;
			article.title = database.index.articleIndex[i].t;
			list.articles.push(article);
		}
		if(database.index.categoryIndex) for(let i in database.index.categoryIndex)
		{
			let category = {};
			category.id = i;
			category.t = database.index.categoryIndex[i].t;
			list.categories.push(category);
		}
		appWindows[0].webContents.send("listArticles", list);
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
	appWindows[0].webContents.on("dom-ready", async () => {
		if(prefs.lastSetting)
		{
			await database.init(prefs.lastSetting);
			sendArticles();
		}
		if(prefs.lastView)
		{
			appWindows[0].webContents.send("setView", prefs.lastView);
		}
		if(prefs.lastArticle)
		{
			ipcMain._events.loadArticle({}, prefs.lastArticle);
		}
		if(prefs.lastCategory)
		{
			ipcMain._events.loadCategory({}, prefs.lastCategory);
		}
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
				prefs.lastSetting = selection.filePaths[0];
				database.saveJSON("prefs.json", prefs);
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
		click: () => {
			appWindows[0].webContents.send("setView", "articles");
			prefs.lastView = "articles";
			database.saveJSON("prefs.json", prefs);
		},
	}));
	viewMenu.submenu.append(new MenuItem({
		label: "Categories",
		accelerator: "",
		type: "normal",
		click: () => {
			appWindows[0].webContents.send("setView", "categories");
			prefs.lastView = "categories";
			database.saveJSON("prefs.json", prefs);
		},
	}));
	viewMenu.submenu.append(new MenuItem({
		label: "Map",
		accelerator: "",
		type: "normal",
		click: () => {
			appWindows[0].webContents.send("setView", "map");
			prefs.lastView = "map";
			database.saveJSON("prefs.json", prefs);
		},
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
