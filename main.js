"use strict";
const { app, BrowserWindow, Menu, MenuItem, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const DataManager = require("./DataManager.js");
const md = require('markdown-it')();
const Handlebars = require('handlebars');

async function compileHandlebarTemplates()
{
	let themes = await fs.promises.readdir("themes");
	for(let i in themes)
	{
		if((await fs.promises.stat("themes" + path.sep + themes[i])).isDirectory() && (await fs.promises.stat("themes" + path.sep + themes[i] + path.sep + "templates")).isDirectory())
		{
			let files = await fs.promises.readdir("themes" + path.sep + themes[i] + path.sep + "templates");
			for(let k in files)
			{
				if(path.extname(files[k]).toLowerCase() == ".html")
				{
					let tFile = "themes" + path.sep + themes[i] + path.sep + "templates" + path.sep + files[k];
					let cFile = "themes" + path.sep + themes[i] + path.sep + "templates" + path.sep + path.basename(files[k],".html") + ".js";
					let tStat = await fs.promises.stat(tFile);
					let tModTime = tStat.mtimeMs;
					let cModTime;
					try
					{
						let cStat = await fs.promises.stat(cFile);
						cModTime = cStat.mtimeMs;
					}
					catch(err)
					{
						cModTime = 0;
					}
					if(cModTime < tModTime)
					{
						let input = await fs.promises.readFile(tFile, {encoding:"utf-8"});
						await fs.promises.writeFile(cFile, "module.exports="+Handlebars.precompile(input));
					}
				}
			}
		}
	}
}

const database = new DataManager();
const appWindows = [];
const prefs = {};

app.whenReady().then(async () => {
	let prefsTemp = await database.loadJSON("prefs.json");
	await compileHandlebarTemplates();
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
		let id = data.f['*'].id;
		if(await database.saveData(data, false, !!id))
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

// findData should have either an id (to edit existing article) or a title property (to create a new one).
ipcMain.on("loadArticle", async (event, findData) => {
	if(database.index)
	{
		let data;
		if(findData.id)
			data = await database.loadData(findData.id, false);
		else
			data = {c:["*"],f:{'*':{t:findData.title}}};
		// Don't modify `data` past this point, since it might be a reference to the saved metadata object, which we may want to reuse in its original unmodified form.
		let categories = {};
		let bonusData = {f:{}};
		for(let i in data.c)
		{
			bonusData.f[data.c[i]] = {};
			let categoryData = await database.loadData(data.c[i], true);
			for(let f in categoryData.f)
			{
				if(categoryData.f[f].m && data.f[data.c[i]] && data.f[data.c[i]][f])
				{
					bonusData.f[data.c[i]][f+":Markdown"] = md.render(data.f[data.c[i]][f].replace(/\[\[(.*?)]]/g, (match,p1,offset,string) => {
						if(database.index.ai) for(let i in database.index.ai)
						{
							if(typeof(database.index.ai[i].t) == "string" && database.index.ai[i].t.toLowerCase() == p1.toLowerCase())
							{
								return "["+ p1 +"](#"+ i +")";
							}
						}
						return "["+ p1 +"](##"+ database.convertToID(p1) +")";
					}));
				}
			}
			categories[data.c[i]] = categoryData;
		}
		appWindows[0].webContents.send("loadArticle", (findData.id?findData.id:""), data, bonusData, categories);
		prefs.lastArticle = findData;
		prefs.lastView = "articles";
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

ipcMain.on("deleteArticle", async (event, data) => {
	let choice = await showMessage({
		type: "question",
		buttons: ["Cancel", "Delete"],
		title: "Confirm Article Deletion",
		message: "Are you sure you want to delete article \""+ (data.articleTitle?data.articleTitle:data.articleID) +"\"?",
	});
	if(choice.response == 1)
	{
		if(await database.deleteData(data.articleID, false))
		{
			sendArticles();
		}
	}
});

ipcMain.on("saveCategory", async (event, data) => {
	if(database.index)
	{
		let id = data.id;
		if(await database.saveData(data, true, !!id))
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

// findData should have either an id (to edit existing category) or a title property (to create a new one).
ipcMain.on("loadCategory", async (event, findData) => {
	if(database.index)
	{
		let data;
		if(findData.id)
			data = await database.loadData(findData.id, true)
		else
			data = {t:findData.title};
		// Don't modify `data` past this point, since it might be a reference to the saved index object, which we do not want to arbitrarily modify.
		appWindows[0].webContents.send("loadCategory", (findData.id?findData.id:""), data);
		prefs.lastCategory = findData;
		prefs.lastView = "categories";
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

ipcMain.on("deleteCategory", async (event, data) => {
	let choice = await showMessage({
		type: "question",
		buttons: ["Cancel", "Delete"],
		title: "Confirm Category Deletion",
		message: "Are you sure you want to delete category \""+ (data.categoryTitle?data.categoryTitle:data.categoryID) +"\"?\nNote: Articles will be unaffected.",
	});
	if(choice.response == 1)
	{
		if(await database.deleteData(data.categoryID, true))
		{
			sendArticles();
		}
	}
});

ipcMain.on("editCategorization", async (event, data) => {
	let category;
	if(data.newTitle)
	{
		for(let i in database.index.ci)
			if(database.index.ci[i].t == data.newTitle)
				category = i;
		if(!category)
			for(let i in database.index.ci)
				if(i == data.newTitle)
					category = i;
	}
	else if(data.removeId)
	{
		category = data.removeId;
	}
	if(category)
	{
		let categoryList = data.categoryList;
		let saveMethod;
		let saveObj;
		if(data.articleID)
		{
			saveMethod = ipcMain._events.saveArticle;
			saveObj = {
				f: {'*': {id: data.articleID}},
				c: categoryList,
			};
		}
		else if(data.categoryID)
		{
			saveMethod = ipcMain._events.saveCategory;
			saveObj = {
				id: data.categoryID,
				c: categoryList,
			};
		}
		else
		{
			console.warn("Unable to edit categorization:", data);
			return false;
		}
		if(data.removeId)
		{
			let i = categoryList.indexOf(category);
			categoryList.splice(i, 1);
			saveMethod(event, saveObj);
			return true;
		}
		else if(categoryList.indexOf(category) == -1)
		{
			categoryList.push(category);
			saveMethod(event, saveObj);
			return true;
		}
		return false;
	}
	else
	{
		console.warn("Unable to edit categorization:", data);
		return false;
	}
});

ipcMain.on("inspect", (event, data) => {
	appWindows[0].webContents.inspectElement(Math.round(data.left), Math.round(data.top));
});

function sendArticles()
{
	listArticles();
	listCategories();
}

function listArticles()
{
	if(database.index && appWindows[0])
	{
		let list = [];
		if(database.index.ai) for(let i in database.index.ai)
		{
			list.push({
				id: i,
				t: database.index.ai[i].t,
				c: database.index.ai[i].c,
			});
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

function listCategories()
{
	if(database.index && appWindows[0])
	{
		let list = [];
		if(database.index.ci) for(let i in database.index.ci)
		{
			list.push({
				id: i,
				t: database.index.ci[i].t,
				c: database.index.ci[i].c,
			});
		}
		appWindows[0].webContents.send("listCategories", list);
	}
	else
	{
		showMessage({
			type: "error",
			title: "Failed to Display Categories",
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
		case "question":
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
		label: "Create Setting...",
		accelerator: "CommandOrControl+O",
		type: "normal",
		click: async function(){
			let selection = await dialog.showOpenDialog(appWindows[0], {
				title: "Create Setting...",
				properties: ["openDirectory","createDirectory","promptToCreate"],
			});
			if(!selection.canceled)
			{
			}
		},
	}));
	fileMenu.submenu.append(new MenuItem({
		label: "Open Setting...",
		accelerator: "CommandOrControl+O",
		type: "normal",
		click: async function(){
			let selection = await dialog.showOpenDialog(appWindows[0], {
				title: "Open Setting...",
				properties: ["openFile"],
				filters: [
					{name:"JSON", extensions:["json"]},
					{name:"All Files", extensions:["*"]},
				],
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
	/*fileMenu.submenu.append(new MenuItem({
		label: "Save Map As...",
		accelerator: "CommandOrControl+S",
		type: "normal",
		click: () => {appWindows[0].webContents.executeJavaScript("window.world.save('map');").then(console.log).catch(console.error);},
	}));*/
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
	toolsMenu.submenu.append(new MenuItem({
		label: "Reload Templates",
		accelerator: "",
		type: "normal",
		click: async () => {
			await compileHandlebarTemplates();
			appWindows[0].webContents._events["dom-ready"]();
		},
	}));
	menu.append(toolsMenu);
	
	Menu.setApplicationMenu(menu);
}
