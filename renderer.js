const { ipcRenderer } = require('electron');
const fs = require('fs');
const maps = require('./MapManager.js');

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

ipcRenderer.on("loadArticle", (event, id, data, bonusData, categories) => {
	data.id = id;
	data.categories = categories;
	for(let i in bonusData)
		data[i] = bonusData[i];
	addArticleFields(data);
});

ipcRenderer.on("loadCategory", (event, id, data) => {
	data.id = id;
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
			if(i == "*" && f == "id" && !data[f])
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
			if(i == "*")
				editElem.name = f;
			else
				editElem.name = i +"_"+ f;
			if(data[f])
			{
				editElem.defaultValue = data[f];
				editElem.value = data[f];
			}
			if(data.categories[i].f[f].n)
				editElem.placeholder = data.categories[i].f[f].n;
			if(data.categories[i].f[f].d)
				editElem.title = data.categories[i].f[f].d;
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

const categoryFieldOptions = {
	'n': {
		type: "text",
		label: "Field Name",
	},
	't': {
		type: "select",
		label: "Field Type",
		options: {
			"text": "Single Line",
			"textarea": "Paragraphs",
		},
	},
	'm': {
		type: "checkbox",
		label: "Use Markdown",
	},
};
function addCategoryFields(data)
{
	let content = document.getElementById("categoriesContent");
	while(content.hasChildNodes())
		content.removeChild(content.firstChild);
	content.appendChild(document.createElement("h1")).innerHTML = data.id;
	for(let f in data.f)
	{
		if(data.id == "*" && (f == "id" || f == "title"))
		{
			for(let i in categoryFieldOptions)
			{
				let elem = content.appendChild(document.createElement("input"));
				elem.id = f+"."+i;
				elem.name = f+"."+i;
				elem.type = "hidden";
				elem.defaultValue = (data.f[f][i] ? data.f[f][i] : "");
				elem.value = (data.f[f][i] ? data.f[f][i] : "");
				elem.classList.add("categoryDataEdit");
			}
		}
		else
		{
			let table = content.appendChild(document.createElement("table"));
			table.classList.add("categoryDataContainer");
			let tbody = table.appendChild(document.createElement("tbody"));
			
			// Setup edit box.
			let caption = table.appendChild(document.createElement("caption"));
			caption.innerHTML = f;
			
			for(let i in categoryFieldOptions)
			{
				let tr = tbody.appendChild(document.createElement("tr"));
				let th = tr.appendChild(document.createElement("th"));
				let label = th.appendChild(document.createElement("label"));
				label.htmlFor = f+"."+i;
				label.innerHTML = categoryFieldOptions[i].label+":";
				let td = tr.appendChild(document.createElement("td"));
				let elem;
				if(categoryFieldOptions[i].type == "select")
				{
					elem = td.appendChild(document.createElement("select"));
					for(let o in categoryFieldOptions[i].options)
					{
						let option = elem.appendChild(document.createElement("option"));
						option.value = o;
						option.innerHTML = categoryFieldOptions[i].options[o];
					}
					elem.value = data.f[f][i];
				}
				else
				{
					elem = td.appendChild(document.createElement("input"));
					elem.type = categoryFieldOptions[i].type;
					if(categoryFieldOptions[i].type == "checkbox")
					{
						elem.value = "1";
						elem.checked = data.f[f][i];
					}
					else
					{
						elem.defaultValue = data.f[f][i];
						elem.value = data.f[f][i];
					}
				}
				elem.id = f+"."+i;
				elem.name = f+"."+i;
				elem.classList.add("categoryDataEdit");
			}
		}
	}
	let save = document.createElement("input");
	save.type = "button";
	save.value = "Save Category";
	content.appendChild(save);
	save.addEventListener("click", event => {
		let newData = {id:data.id,f:{}};
		let dataElements = document.querySelectorAll(".categoryDataEdit");
		dataElements.forEach((node, idx, list) => {
			let n = node.name.lastIndexOf(".");
			let id = node.name.substring(0, n);
			let name = node.name.substring(n+1);
			if(!newData.f[id])
				newData.f[id] = {};
			if(node.type == "checkbox")
			{
				if(node.checked)
					newData.f[id][name] = true;
			}
			else if(categoryFieldOptions[name].type == "checkbox")
			{
				if(node.value)
					newData.f[id][name] = true;
			}
			else if(node.value)
				newData.f[id][name] = node.value;
		});
		ipcRenderer.send("saveCategory", newData);
	});
}

window.world = new maps.WorldMap([0,0], 2112);
window.world.resize();
window.onresize = window.world.resize;
//window.world.load("saved/map.json");

/*var continent = new maps.MapImage("images/worldmap.png", [0,0], 2112);
window.world.addMapImage(continent);
var region = new maps.MapImage("images/southernplains.png", [769773,628539], 752);
window.world.addMapImage(region);*/