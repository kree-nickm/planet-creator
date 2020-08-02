const { ipcRenderer } = require('electron');
const fs = require('fs');
const maps = require('./MapManager.js');

// TODO: These first two will need to be re-done when the class declaration is moved out of here.
ipcRenderer.on("openMap", (event, mapJSON) => {
	window.world.load(mapJSON);
});

ipcRenderer.on("openMapImages", (event, imageFiles) => {
	for(let i in imageFiles)
		window.world.addMapImage(new maps.MapImage(imageFiles[i], [0,0], window.world.feetPerPixel));
});

// TODO: See if BrowserView is better for this?
ipcRenderer.on("setView", (event, view) => {
	let viewElements = document.querySelectorAll(".view");
	viewElements.forEach((node, idx, list) => {
		if(node.id == view +"View")
		{
			if(!node.classList.contains("view-selected"))
				node.classList.add("view-selected");
		}
		else if(node.classList.contains("view-selected"))
			node.classList.remove("view-selected");
	});
});

ipcRenderer.on("listArticles", (event, list) => {
	if(list.articles && list.articles.length)
		addArticles(list.articles);
	if(list.categories && list.categories.length)
		addCategories(list.categories);
});

function addArticles(list)
{
	let sidebar = document.getElementById("articlesSidebar");
	// Reset existing.
	while(sidebar.hasChildNodes())
		sidebar.removeChild(sidebar.firstChild);
	// Add 'Create New'
	let link = document.createElement("a");
	link.href = "#";
	link.innerHTML = "Create New...";
	sidebar.appendChild(link);
	link.addEventListener("click", handleArticleLink);
	// Add all the articles.
	list.sort(sortByTitle);
	for(let i in list)
	{
		let link = document.createElement("a");
		link.href = "#"+ list[i].id;
		if(list[i].title)
			link.innerHTML = list[i].title;
		else
			link.innerHTML = list[i].id;
		sidebar.appendChild(link);
		link.addEventListener("click", handleArticleLink);
	}
}

function addCategories(list)
{
	let sidebar = document.getElementById("categoriesSidebar");
	// Reset existing.
	while(sidebar.hasChildNodes())
		sidebar.removeChild(sidebar.firstChild);
	// Add 'Create New'
	let link = document.createElement("a");
	link.href = "#";
	link.innerHTML = "Create New...";
	sidebar.appendChild(link);
	link.addEventListener("click", handleCategoryLink);
	// Add all the categories.
	list.sort(sortByID);
	for(let i in list)
	{
		let link = document.createElement("a");
		link.href = "#"+ list[i].id;
		//if(list[i].id)
		//	link.innerHTML = list[i].id;
		//else
			link.innerHTML = list[i].id;
		sidebar.appendChild(link);
		link.addEventListener("click", handleCategoryLink);
	}
}

ipcRenderer.on("loadArticle", (event, data) => {
	addArticleFields(data);
});

ipcRenderer.on("loadCategory", (event, data) => {
	addCategoryFields(data);
});

function handleArticleLink(event)
{
	let hash = event.target.hash;
	if(hash == "#")
		ipcRenderer.send("loadArticle", {});
	else if(hash.startsWith("##"))
		ipcRenderer.send("loadArticle", {title:event.target.innerHTML});
	else
		ipcRenderer.send("loadArticle", {id:hash.substring(1)});
}

function handleCategoryLink(event)
{
	let hash = event.target.hash;
	if(hash == "#")
		ipcRenderer.send("loadCategory", {});
	else if(hash.startsWith("##"))
		ipcRenderer.send("loadCategory", {id:hash.substring(2)});
	else
		ipcRenderer.send("loadCategory", {id:hash.substring(1)});
}

const stringCollator = new Intl.Collator("en");
function sortByTitle(a, b) {
	if(!a.title && !b.title)
		return 0;
	else if(!a.title)
		return 1;
	else if(!b.title)
		return -1;
	else
		return stringCollator.compare(a.title, b.title);
}
function sortByID(a, b) {
	if(!a.id && !b.id)
		return 0;
	else if(!a.id)
		return 1;
	else if(!b.id)
		return -1;
	else
		return stringCollator.compare(a.id, b.id);
}

function addArticleFields(data)
{
	let content = document.getElementById("articlesContent");
	while(content.hasChildNodes())
		content.removeChild(content.firstChild);
	for(let i in data.categories)
	{
		for(let f in data.categories[i].f)
		{
			if(data.categories[i].f[f].s && !data[f])
				continue;
			
			let container = document.createElement("div");
			container.classList.add("articleDataContainer", "reading");
			content.appendChild(container);
			
			// Setup edit box.
			let editElem;
			if(data.categories[i].f[f].t == "textarea")
			{
				editElem = document.createElement("textarea");
			}
			else
			{
				editElem = document.createElement("input");
				editElem.type = data.categories[i].f[f].t ? data.categories[i].f[f].t : "text";
			}
			editElem.name = f;
			if(data[f])
			{
				editElem.defaultValue = data[f];
				editElem.value = data[f];
			}
			if(data.categories[i].f[f].n)
				editElem.placeholder = data.categories[i].f[f].n;
			editElem.classList.add("articleDataEdit");
			container.appendChild(editElem);
			
			// Setup read box.
			if(editElem.type != "hidden")
			{
				let readElem = document.createElement("div");
				let readText = document.createElement("span");
				if(data[f])
				{
					if(data.categories[i].f[f].m)
					{
						readText.innerHTML = data[f+":Markdown"];
						let links = readText.querySelectorAll("a[href^='#']");
						links.forEach((node, idx, list) => {
							node.addEventListener("click", handleArticleLink);
							if(node.hash.startsWith("##"))
								node.classList.add("broken");
						});
					}
					else
						readText.innerHTML = data[f];
				}
				else
				{
					readText.innerHTML = "";
					container.classList.add("editing");
					container.classList.remove("reading");
				}
				let editButton = document.createElement("button");
				editButton.innerHTML = "edit";
				editButton.classList.add("edit");
				readElem.appendChild(editButton);
				readElem.appendChild(readText);
				editButton.addEventListener("click", ((event) => {
					container.classList.add("editing");
					container.classList.remove("reading");
				}).bind(container));
				readElem.classList.add("articleDataRead");
				container.appendChild(readElem);
			}
		}
	}
	let save = document.createElement("input");
	save.type = "button";
	save.value = "Save Article";
	content.appendChild(save);
	save.addEventListener("click", event => {
		let data = {};
		let dataElements = document.querySelectorAll(".articleDataEdit");
		dataElements.forEach((node, idx, list) => {
			if(node.value != "")
				data[node.name] = node.value;
		});
		ipcRenderer.send("saveArticle", data);
	});
}

function addCategoryFields(data)
{
	console.log(data);
}

window.world = new maps.WorldMap([0,0], 2112);
window.world.resize();
window.onresize = window.world.resize;
//window.world.load("saved/map.json");

/*var continent = new maps.MapImage("images/worldmap.png", [0,0], 2112);
window.world.addMapImage(continent);
var region = new maps.MapImage("images/southernplains.png", [769773,628539], 752);
window.world.addMapImage(region);*/