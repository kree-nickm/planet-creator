const { ipcRenderer } = require('electron');
const fs = require('fs');

// TODO: These first two will need to be re-done when the class declaration is moved out of here.
ipcRenderer.on("openMap", (event, mapJSON) => {
	window.world.load(mapJSON);
});

ipcRenderer.on("openMapImages", (event, imageFiles) => {
	for(let i in imageFiles)
		window.world.addMapImage(new MapImage(imageFiles[i], [0,0], window.world.feetPerPixel));
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

ipcRenderer.on("listArticles", (event, articleList) => {
	articleList.sort(sortByTitle);
	let sidebar = document.getElementById("articlesSidebar");
	// Reset existing.
	while(sidebar.hasChildNodes())
		sidebar.removeChild(sidebar.firstChild);
	// Add 'Create New'.
	let link = document.createElement("a");
	link.href = "#";
	link.innerHTML = "Create New...";
	sidebar.appendChild(link);
	link.addEventListener("click", (event) => {
		addArticleFields({});
	});
	// Add all the articles.
	for(let i in articleList)
	{
		let link = document.createElement("a");
		link.href = "#"+ articleList[i].id;
		if(articleList[i].title)
			link.innerHTML = articleList[i].title;
		else
			link.innerHTML = articleList[i].id;
		sidebar.appendChild(link);
		link.addEventListener("click", (event) => {
			ipcRenderer.send("loadArticle", event.target.hash.substring(1));
		});
	}
});

ipcRenderer.on("loadArticle", (event, data) => {
	addArticleFields(data);
});

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

function addArticleFields(data)
{
	let content = document.getElementById("articlesContent");
	while(content.hasChildNodes())
		content.removeChild(content.firstChild);
	// TODO: Add fields based on templates.
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
			},
		}
	};
	for(let t in templates)
	{
		for(let f in templates[t])
		{
			if(templates[t][f].onlyIfSet && !data[f])
				continue;
			
			let elem;
			if(templates[t][f].type == "textarea")
			{
				elem = document.createElement("textarea");
			}
			else
			{
				elem = document.createElement("input");
				elem.type = templates[t][f].type ? templates[t][f].type : "text";
			}
			elem.name = f;
			if(data[f])
			{
				elem.defaultValue = data[f];
				elem.value = data[f];
			}
			if(templates[t][f].description)
				elem.placeholder = templates[t][f].description;
			elem.classList.add("articleData");
			let container = document.createElement("div");
			container.classList.add("articleDataContainer");
			content.appendChild(container);
			container.appendChild(elem);
		}
	}
	let save = document.createElement("input");
	save.type = "button";
	save.value = "Save Article";
	content.appendChild(save);
	save.addEventListener("click", event => {
		let data = {};
		let dataElements = document.querySelectorAll(".articleData");
		dataElements.forEach((node, idx, list) => {
			if(node.value != "")
				data[node.name] = node.value;
		});
		ipcRenderer.send("saveArticle", data);
	});
}

// TODO: Move this out of here into its own file.
function WorldMap(coordinates, feetPerPixel)
{
	this.coordinates = coordinates;
	this.feetPerPixel = feetPerPixel;
	this.mapImages = [];
	this.controls = document.getElementById("mapImageControls");
	this.canvas = document.getElementById("mapCanvas");
	this.ctx = this.canvas.getContext("2d");
	this.delayDraw = 0;
	this.mapImageSelected = null;
	
	this.updateSelected = (function(event)
	{
		if(this.mapImageSelected != null)
		{
			this.mapImageSelected.updateProperties();
			this.draw();
		}
	}).bind(this);
	
	this.resize = (function()
	{
		this.canvas.width = window.innerWidth-250;
		this.canvas.height = window.innerHeight;
		this.controls.width = 250;
		this.controls.height = window.innerHeight;
		this.draw();
	}).bind(this);
	
	this.addMapImage = function(mapImage)
	{
		mapImage.createElement(this.draw);
		this.mapImages.push(mapImage);
		this.mapImages.sort(function(a,b){return b.feetPerPixel - a.feetPerPixel;});
	}
	
	this.changeZoom = (function(event)
	{
		var amount = this.feetPerPixel / event.deltaY * 5 * (event.shiftKey?10:1) * (event.ctrlKey?0.1:1);
		this.feetPerPixel += amount;
		if(this.feetPerPixel < 0.001)
			this.feetPerPixel -= amount;
		if(this.feetPerPixel > 1000000)
			this.feetPerPixel = 1000000;
		this.draw();
	}).bind(this);
	
	this.scroll = function(movementX, movementY)
	{
		this.coordinates[0] -= movementX * this.feetPerPixel;
		this.coordinates[1] -= movementY * this.feetPerPixel;
		this.draw();
	}
	
	this.draw = (function()
	{
		//console.log("Current feetPerPixel:", this.feetPerPixel, "Current center:", this.coordinates);
		if(Date.now() - this.lastDrawTime < 10)
		{
			clearTimeout(this.delayDraw);
			this.delayDraw = setTimeout(this.draw, 10);
			return false;
		}
		this.lastDrawTime = Date.now();
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for(var i in this.mapImages)
		{
			// Determine if map is on the screen.
			if(this.mapImages[i].element != null && this.mapImages[i].element.complete)
				this.drawElement(this.mapImages[i]);
		}
	}).bind(this);
	
	this.drawElement = function(mapImage)
	{
		var mapImageScale = mapImage.feetPerPixel / this.feetPerPixel;
		var offset = [
			Math.round((mapImage.coordinates[0] - this.coordinates[0]) / mapImage.feetPerPixel * mapImageScale),
			Math.round((mapImage.coordinates[1] - this.coordinates[1]) / mapImage.feetPerPixel * mapImageScale)
		];
		var canvasCenter = [Math.round(this.canvas.width/2), Math.round(this.canvas.height/2)];
		var mapImageCenter = [Math.round(mapImage.width*mapImageScale/2), Math.round(mapImage.height*mapImageScale/2)];
		mapImage.drawX = canvasCenter[0] - mapImageCenter[0] + offset[0];
		mapImage.drawY = canvasCenter[1] - mapImageCenter[1] + offset[1];
		mapImage.drawW = Math.round(mapImage.width * mapImageScale);
		mapImage.drawH = Math.round(mapImage.height * mapImageScale);
		this.ctx.drawImage(mapImage.canvas, mapImage.drawX, mapImage.drawY, mapImage.drawW, mapImage.drawH);
	}
	
	this.findTarget = function(x, y)
	{
		var result = null;
		for(var i in this.mapImages)
		{
			if(x >= this.mapImages[i].drawX && y >= this.mapImages[i].drawY && x <= this.mapImages[i].drawX+this.mapImages[i].drawW && y <= this.mapImages[i].drawY+this.mapImages[i].drawH)
			{
				result = this.mapImages[i];
			}
		}
		return result;
	}
	
	this.load = function(data)
	{
		this.coordinates = data.coordinates;
		this.feetPerPixel = data.feetPerPixel;
		this.mapImages = [];
		for(var i in data.mapImages)
		{
			this.addMapImage(new MapImage(
				data.mapImages[i].file,
				data.mapImages[i].coordinates,
				data.mapImages[i].feetPerPixel
			));
		}
	}
	
	this.save = function(mapName)
	{
		var data = {
			coordinates: this.coordinates,
			feetPerPixel: this.feetPerPixel,
			mapImages: [],
		};
		for(var i in this.mapImages)
		{
			data.mapImages.push({
				file: this.mapImages[i].file,
				coordinates: this.mapImages[i].coordinates,
				feetPerPixel: this.mapImages[i].feetPerPixel,
			});
		}
		fs.writeFile("saved/"+ mapName +".json", JSON.stringify(data), function(err){
			if(err)
				console.error(err);
		});
		return this;
	}
	
	this.canvas.onmousedown = (function(event){
		if(event.which == 1)
		{
			this.mapImageSelected = this.findTarget(event.offsetX, event.offsetY);
			if(this.mapImageSelected != null)
			{
				var options = this.controls.children;
				console.log(options);
				for(var i=0; i<options.length; i++)
				{
					var id = options.item(i).id;
					switch(id)
					{
						case "mapImageFPP":
							options.item(i).value = this.mapImageSelected.feetPerPixel;
							break;
						case "mapImageX":
							options.item(i).value = this.mapImageSelected.coordinates[0];
							break;
						case "mapImageY":
							options.item(i).value = this.mapImageSelected.coordinates[1];
							break;
						case "mapImageName":
							options.item(i).innerHTML = this.mapImageSelected.file.substr(this.mapImageSelected.file.lastIndexOf("\\"));
							break;
					}
				}
			}
		}
	}).bind(this);
	
	this.canvas.onmousemove = (function(event){
		if(event.which == 3)
		{
			this.scroll(event.movementX, event.movementY);
		}
		else if(event.which == 1 && this.mapImageSelected != null)
		{
			this.mapImageSelected.scroll(event.movementX, event.movementY, this);
		}
	}).bind(this);
	
	this.canvas.onwheel = this.changeZoom;
	document.getElementById("mapImageFPP").addEventListener("change", this.updateSelected);
	document.getElementById("mapImageX").addEventListener("change", this.updateSelected);
	document.getElementById("mapImageY").addEventListener("change", this.updateSelected);
	//this.canvas.onkeydown = logevent;
}

function MapImage(file, coordinates, feetPerPixel)
{
	this.file = file;
	this.coordinates = coordinates;
	this.feetPerPixel = feetPerPixel;
	this.element = null;
	this.canvas = null;
	this.ctx = null;
	this.imageData = null;
	this.width = 0;
	this.height = 0;
	
	this.createElement = function(callback)
	{
		if(this.imageData != null)
			return callback(this);
		else if(this.element == null)
		{
			this.element = document.createElement("img");
			this.element.onload = this.elementLoaded.bind(this, callback);
			this.element.src = this.file;
		}
		else if(!this.element.complete)
		{
			// Is there anything we should do here?
			console.warn("MapImage.createElement has been called so fast that the element has been created but hasn't finished loading yet. Be patient. >:|");
		}
		else
			return callback(this);
	}
	
	this.elementLoaded = function(callback, event)
	{
		this.createImageData();
		callback(this);
	}
	
	this.createImageData = function()
	{
		this.canvas = new OffscreenCanvas(this.element.naturalWidth, this.element.naturalHeight);
		this.ctx = this.canvas.getContext("2d");
		this.ctx.drawImage(this.element, 0, 0, this.canvas.width, this.canvas.height);
		this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		this.processImageData();
		this.width = this.imageData.width;
		this.height = this.imageData.height;
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.putImageData(this.imageData, 0, 0);
	}
	
	this.processImageData = function()
	{
		var i = 0;
		while(i < this.imageData.data.length)
		{
			if(this.imageData.data[i] == 243 && this.imageData.data[i+1] == 223 && this.imageData.data[i+2] == 191)
				this.imageData.data[i+3] = 0;
			i += 4;
		}
	}
	
	this.scroll = (function(movementX, movementY, worldMap)
	{
		this.coordinates[0] += movementX * worldMap.feetPerPixel;
		this.coordinates[1] += movementY * worldMap.feetPerPixel;
		worldMap.draw();
	}).bind(this);
	
	this.updateProperties = (function(event)
	{
		this.controls = document.getElementById("mapImageControls");
		this.feetPerPixel = document.getElementById("mapImageFPP").value;
		this.coordinates[0] = document.getElementById("mapImageX").value;
		this.coordinates[1] = document.getElementById("mapImageY").value;
	}).bind(this);
}

window.world = new WorldMap([0,0], 2112);
window.world.resize();
window.onresize = window.world.resize;
//window.world.load("saved/map.json");

/*var continent = new MapImage("images/worldmap.png", [0,0], 2112);
window.world.addMapImage(continent);
var region = new MapImage("images/southernplains.png", [769773,628539], 752);
window.world.addMapImage(region);*/