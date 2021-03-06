const { ipcRenderer } = require('electron');
const fs = require('fs');
const maps = require("./MapManager.js");
const $ = jQuery = require('jquery');
require("./node_modules/jquery-ui-dist/jquery-ui.min.js");
const Handlebars = require('handlebars');

const customHelpers = require("./themes/handlebars.helpers.js");
for(let i in customHelpers)
	Handlebars.registerHelper(customHelpers[i].tag, customHelpers[i].fn);

const Renderer = new (function(){
	this.theme = "default";
	this.categoriesList = [];
	this.articleIndex = {};
	this.categoryIndex = {};
	this.stringCollator = new Intl.Collator("en");
	this.handlebarsTemplates = {};
	this.requiredFiles = {};
	this.contextMenu = [];
	this.categoryFieldOptions = {
		'n': {
			type: "text",
			label: "Field Name",
		},
		't': {
			checkConditions: true,
			type: "select",
			label: "Field Type",
			options: {
				"text": "Single Line",
				"textarea": "Paragraphs",
				"number": "Number",
				"date": "Date",
				"datetime-local": "Date and Time",
				"file": "File of Specified Type",
				"select": "Predefined Options",
			},
		},
		'f': {
			checkConditions: true,
			condition: function(fieldContainer){
				let type = $(fieldContainer).find(".field-t").val();
				return type == "select";
			},
			type: "select",
			label: "Option Filter",
			options: {
				"articles": "All Articles",
				"category": "Articles in Specified Category",
			},
		},
		'g': {
			condition: function(fieldContainer){
				let type = $(fieldContainer).find(".field-t").val();
				let filter = $(fieldContainer).find(".field-f").val();
				return type == "select" && (filter == "category") || type == "file";
			},
			type: "select",
			label: "Specify",
			optionsFunc: function(fieldContainer){
				let type = $(fieldContainer).find(".field-t").val();
				if(type == "select")
				{
					let filter = $(fieldContainer).find(".field-f").val();
					switch(filter)
					{
						case "category":
							let result = {}
							for(let i in Renderer.categoryIndex)
								result[i] = Renderer.categoryIndex[i].t;
							return result;
							break;
					}
				}
				else if(type == "file")
				{
					return {
						'*': "All Files",
						'image/*': "Images",
					};
				}
			},
		},
		'a': {
			condition: function(fieldContainer){
				let type = $(fieldContainer).find(".field-t").val();
				return type == "file" || type == "select";
			},
			type: "checkbox",
			label: "Allow Multiple",
		},
		'm': {
			condition: function(fieldContainer){
				let type = $(fieldContainer).find(".field-t").val();
				return type == "text" || type == "textarea";
			},
			type: "checkbox",
			label: "Use Markdown",
		},
		'e': {
			condition: function(fieldContainer){
				let type = $(fieldContainer).find(".field-t").val();
				return type == "textarea";
			},
			type: "checkbox",
			label: "Can Get Content From File",
		},
	};
	
	this.send = function(channel, data)
	{
		ipcRenderer.send(channel, data);
	}
	
	this.loadTemplate = function(templateFile)
	{
		let module = this.requireFile(templateFile, true);
		if(!this.handlebarsTemplates[templateFile] || module.time > this.handlebarsTemplates[templateFile].time)
		{
			this.handlebarsTemplates[templateFile] = {
				template: Handlebars.template(module.module),
				time: module.time,
			};
		}
		return this.handlebarsTemplates[templateFile].template;
	};
	
	this.requireFile = function(nodeFile, withTime)
	{
		if(fs.existsSync(nodeFile))
		{
			let stat = fs.statSync(nodeFile);
			let modTime = stat.mtimeMs;
			if(!this.requiredFiles[nodeFile] || modTime > this.requiredFiles[nodeFile])
			{
				let resolve = require.resolve("./"+ nodeFile);
				if(require.cache[resolve])
					delete require.cache[resolve];
				this.requiredFiles[nodeFile] = modTime;
			}
			if(withTime)
				return {module:require("./"+ nodeFile), time:this.requiredFiles[nodeFile]};
			else
				return require("./"+ nodeFile);
		}
		else
			throw "Tried to load non-existent Node.js file '"+ nodeFile +"'.";
	};
	
	this.handleArticleLink = function(event)
	{
		let hash = event.target.hash;
		if(hash == "#")
			this.send("loadArticle", {});
		else if(hash.startsWith("##"))
			this.send("loadArticle", {title:event.target.innerHTML});
		else
			this.send("loadArticle", {id:hash.substring(1)});
	};
	
	this.handleCategoryLink = function(event)
	{
		let hash = event.target.hash;
		if(hash == "#")
			this.send("loadCategory", {});
		else if(hash.startsWith("##"))
			this.send("loadCategory", {id:hash.substring(2)});
		else
			this.send("loadCategory", {id:hash.substring(1)});
	};

	this.addArticleFields = function(data)
	{
		let content = $("#articlesContent");
		content.empty();
		let templateData = {
			categories: [],
		};
		let scripts = {};
		// TODO: Show orphaned fields (if a category is removed from an article when it still had fields filled in, those are now orphaned).
		for(let c in data.categories)
		{
			// Determine template file for this category.
			let theme = this.theme;
			let templateFile;
			if(c == "*")
				templateFile = "article.all.articles.js";
			else
				templateFile = "article."+ c +".js";
			let templateFilePath = "themes/"+ this.theme +"/templates/" + templateFile;
			if(!fs.existsSync(templateFilePath))
				templateFilePath = "themes/"+ this.theme +"/templates/article.default.category.js";
			if(!fs.existsSync(templateFilePath))
			{
				theme = "default";
				templateFilePath = "themes/default/templates/" + templateFile;
				if(!fs.existsSync(templateFilePath))
					templateFilePath = "themes/default/templates/article.default.category.js";
			}
			
			// Register partial template from above file, and check for template scripts.
			if(fs.existsSync(templateFilePath))
			{
				Handlebars.registerPartial("article."+c, this.loadTemplate(templateFilePath));
				if(!scripts[theme] && fs.existsSync("themes/"+ theme +"/scripts.js"))
					scripts[theme] = this.requireFile("./themes/"+ theme +"/scripts.js");
			}
			else
				console.error("Unable to load a template for this article.", data);
			
			// Build data to send to template.
			let templateFieldData = {
				id: c,
				title: data.categories[c].t,
				fields: [],
				actual: true,
			};
			templateData.categories.push(templateFieldData);
			for(let f in data.categories[c].f)
			{
				let fieldData = {};
				templateFieldData.fields.push(fieldData);
				if(data.f[c] && data.f[c][f])
					fieldData.value = data.f[c][f];
				else
					fieldData.value = "";
				fieldData.valueParsed = fieldData.value;
				fieldData.name = data.categories[c].f[f].n;
				fieldData.description = data.categories[c].f[f].d;
				fieldData.field = f;
				fieldData.type = data.categories[c].f[f].t;
				if(data.categories[c].f[f].t == "select")
				{
					fieldData.options = [];
					if(data.categories[c].f[f].f == "category")
					{
						for(let k in Renderer.articleIndex)
						{
							if(Renderer.articleIndex[k].c.indexOf(data.categories[c].f[f].g) > -1)
							{
								fieldData.options.push({value:k, label:Renderer.articleIndex[k].t});
								if(k == fieldData.value)
									fieldData.options[fieldData.options.length-1].selected = true;
							}
						}
						if(Renderer.articleIndex[fieldData.value])
							fieldData.valueParsed = Renderer.articleIndex[fieldData.value].t;
					}
					else if(data.categories[c].f[f].f == "articles")
					{
						for(let k in Renderer.articleIndex)
						{
							fieldData.options.push({value:k, label:Renderer.articleIndex[k].t});
							if(k == fieldData.value)
								fieldData.options[fieldData.options.length-1].selected = true;
						}
						if(Renderer.articleIndex[fieldData.value])
							fieldData.valueParsed = Renderer.articleIndex[fieldData.value].t;
					}
				}
				if(data.categories[c].f[f].m && data.f[c] && data.f[c][f+':Markdown'])
					fieldData.valueParsed = data.f[c][f+':Markdown'];
			}
		}
		let mainTemplateFile = "themes/"+ this.theme +"/templates/article.js";
		if(!fs.existsSync(mainTemplateFile))
			mainTemplateFile = "themes/default/templates/article.js";
		
		for(let t in scripts)
		{
			if(typeof(scripts[t].beforeArticleContent) == "function")
				scripts[t].beforeArticleContent(content, data);
		}
		
		let template = this.loadTemplate(mainTemplateFile);
		content.append(template(templateData));
		
		for(let t in scripts)
		{
			if(typeof(scripts[t].afterArticleContent) == "function")
				scripts[t].afterArticleContent(content, data);
		}
		
		// Add dynamic stuff.
		content.find("a[href^='#']").each((idx, node) => {
			if($(node).data("type") == "category")
				node.addEventListener("click", Renderer.handleCategoryLink.bind(this));
			else
				node.addEventListener("click", Renderer.handleArticleLink.bind(this));
			if(node.hash.startsWith("##"))
				node.classList.add("broken");
		});
	};
	
	this.addCategoryFields = function(data)
	{
		let content = $("#categoriesContent");
		content.empty();
		let templateData = {
			articleChildren: [],
			categoryChildren: [],
			categories: [],
			data: data,
		};
		let scripts = {};
		let mainTemplateFile = "themes/"+ this.theme +"/templates/category.js";
		if(!fs.existsSync(mainTemplateFile))
		{
			mainTemplateFile = "themes/default/templates/category.js";
			if(!scripts["default"] && fs.existsSync("themes/default/scripts.js"))
				scripts["default"] = this.requireFile("./themes/default/scripts.js");
		}
		else if(!scripts[this.theme] && fs.existsSync("themes/"+ this.theme +"/scripts.js"))
			scripts[this.theme] = this.requireFile("./themes/"+ this.theme +"/scripts.js");
		
		for(let a in Renderer.articleIndex)
		{
			if(Renderer.articleIndex[a].c.indexOf(data.id) > -1)
				templateData.articleChildren.push({id:a, t:Renderer.articleIndex[a].t});
		}
		templateData.articleChildren.sort(Renderer.sortByTitle);
		
		for(let c in Renderer.categoryIndex)
		{
			if(Renderer.categoryIndex[c].c.indexOf(data.id) > -1)
				templateData.categoryChildren.push({id:c, t:Renderer.categoryIndex[c].t});
		}
		templateData.categoryChildren.sort(Renderer.sortByTitle);
		
		for(let i in data.c)
		{
			templateData.categories.push({
				id: data.c[i],
				title: Renderer.categoryIndex[data.c[i]].t,
			});
		}
		
		for(let t in scripts)
		{
			if(typeof(scripts[t].beforeCategoryContent) == "function")
				scripts[t].beforeCategoryContent(content, data);
		}
		
		let template = this.loadTemplate(mainTemplateFile);
		content.append(template(templateData));
		
		for(let t in scripts)
		{
			if(typeof(scripts[t].afterCategoryContent) == "function")
				scripts[t].afterCategoryContent(content, data);
		}
		
		content.find("a[href^='#']").each((idx, node) => {
			if($(node).data("type") == "category")
				node.addEventListener("click", Renderer.handleCategoryLink.bind(this));
			else
				node.addEventListener("click", Renderer.handleArticleLink.bind(this));
			if(node.hash.startsWith("##"))
				node.classList.add("broken");
		});
	};
	
	this.addToContextMenu = function(icon, text, action, divider)
	{
		for(let i in this.contextMenu)
		{
			if(this.contextMenu[i].action == action)
			{
				this.contextMenu[i].icon = icon;
				this.contextMenu[i].text = text;
				return this.contextMenu.length;
			}
		}
		if(this.contextMenu.length && divider)
			this.contextMenu.push({divider: true});
		this.contextMenu.push({icon:icon, text:text, action:action});
		return this.contextMenu.length;
	};
	
	this.showContextMenu = function(show)
	{
		let menu = $("#contextmenu");
		if(show)
		{
			this.addToContextMenu("zoomin", "Inspect Element", event => { Renderer.send("inspect", menu.offset()); }, true);
			menu.addClass("showing").offset({left:event.pageX, top:event.pageY}).html("");
			for(let i in this.contextMenu)
			{
				if(this.contextMenu[i].divider)
					menu.append("<li class=\"ui-state-disabled\"><hr/></li>");
				else
				{
					menu.append("<li><div><span class=\"ui-icon ui-icon-"+ this.contextMenu[i].icon +"\"></span> "+ this.contextMenu[i].text +"</div></li>")
					.children().last().click(this.contextMenu[i].action);
				}
			}
			menu.menu("refresh");
		}
		else
		{
			menu.removeClass("showing");
		}
		this.contextMenu = [];
	};
})();

$(document).on("contextmenu", event => {
	Renderer.showContextMenu(true);
});
$(document).on("click", event => {
	Renderer.showContextMenu(false);
});
$("#contextmenu").menu();

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
	let sidebar = document.getElementById("articlesSidebar");
	// Reset existing.
	while(sidebar.hasChildNodes())
		sidebar.removeChild(sidebar.firstChild);
	// Add 'Create New'
	let link = document.createElement("a");
	link.href = "#";
	link.innerHTML = "Create New...";
	sidebar.appendChild(link);
	link.addEventListener("click", Renderer.handleArticleLink.bind(Renderer));
	// Add all the articles.
	Renderer.articleIndex = {};
	if(Array.isArray(list) && list.length)
	{
		list.sort(sortByTitle);
		for(let i in list)
		{
			Renderer.articleIndex[list[i].id] = list[i];
			let link = document.createElement("a");
			link.href = "#"+ list[i].id;
			if(list[i].t)
				link.innerHTML = list[i].t;
			else
				link.innerHTML = list[i].id;
			sidebar.appendChild(link);
			link.addEventListener("click", Renderer.handleArticleLink.bind(Renderer));
			$(link).contextmenu(event => {
				Renderer.addToContextMenu(
					"trash",
					"Delete \""+ link.innerHTML +"\"",
					event => {
						Renderer.send("deleteArticle", {
							articleID: list[i].id,
							articleTitle: list[i].t,
						});
					},
					true
				);
			});
		}
	}
});

ipcRenderer.on("listCategories", (event, list) => {
	let sidebar = document.getElementById("categoriesSidebar");
	// Reset existing.
	while(sidebar.hasChildNodes())
		sidebar.removeChild(sidebar.firstChild);
	// Add 'Create New'
	let link = document.createElement("a");
	link.href = "#";
	link.innerHTML = "Create New...";
	sidebar.appendChild(link);
	link.addEventListener("click", Renderer.handleCategoryLink.bind(Renderer));
	// Add all the categories.
	Renderer.categoriesList = [];
	Renderer.categoryIndex = {};
	if(Array.isArray(list) && list.length)
	{
		list.sort(sortByID);
		for(let i in list)
		{
			Renderer.categoryIndex[list[i].id] = list[i];
			let link = document.createElement("a");
			link.href = "#"+ list[i].id;
			if(list[i].t)
			{
				Renderer.categoriesList.push(list[i].t);
				link.innerHTML = list[i].t;
			}
			else
			{
				Renderer.categoriesList.push(list[i].id);
				link.innerHTML = list[i].id;
			}
			sidebar.appendChild(link);
			link.addEventListener("click", Renderer.handleCategoryLink.bind(Renderer));
			if(list[i].id != "*")
			{
				$(link).contextmenu(event => {
					Renderer.addToContextMenu(
						"trash",
						"Delete \""+ link.innerHTML +"\"",
						event => {
							Renderer.send("deleteCategory", {
								categoryID: list[i].id,
								categoryTitle: list[i].t,
							});
						},
						true
					);
				});
			}
		}
	}
});

ipcRenderer.on("loadArticle", (event, id, data, bonusData, categories) => {
	//console.log("loadArticle", id, data, bonusData, categories);
	ipcRenderer._events.setView(event, "articles");
	data.f['*'].id = id;
	data.categories = categories;
	for(let c in bonusData.f)
		for(let f in bonusData.f[c])
			data.f[c][f] = bonusData.f[c][f];
	Renderer.addArticleFields(data);
});

ipcRenderer.on("loadCategory", (event, id, data) => {
	//console.log("loadCategory", id, data);
	ipcRenderer._events.setView(event, "categories");
	data.id = id;
	//addCategoryFields(data);
	Renderer.addCategoryFields(data);
});

function sortByTitle(a, b) {
	if(!a.t && !b.t)
		return 0;
	else if(!a.t)
		return 1;
	else if(!b.t)
		return -1;
	else
		return Renderer.stringCollator.compare(a.t, b.t);
}
function sortByID(a, b) {
	if(!a.id && !b.id)
		return 0;
	else if(!a.id)
		return 1;
	else if(!b.id)
		return -1;
	else
		return Renderer.stringCollator.compare(a.id, b.id);
}

window.world = new maps.WorldMap([0,0], 2112);
window.world.resize();
window.onresize = window.world.resize;
//window.world.load("saved/map.json");

/*var continent = new maps.MapImage("images/worldmap.png", [0,0], 2112);
window.world.addMapImage(continent);
var region = new maps.MapImage("images/southernplains.png", [769773,628539], 752);
window.world.addMapImage(region);*/