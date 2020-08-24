const { ipcRenderer } = require('electron');
const fs = require('fs');
const maps = require("./MapManager.js");
const $ = jQuery = require('jquery');
require("./node_modules/jquery-ui-dist/jquery-ui.min.js");
const Handlebars = require('handlebars');

const customHelpers = require("./templates/handlebars.helpers.js");
for(let i in customHelpers)
	Handlebars.registerHelper(customHelpers[i].tag, customHelpers[i].fn);

const Renderer = new (function(){
	this.theme = "default";
	this.categoriesList = [];
	this.articleIndex = {};
	this.categoryIndex = {};
	this.stringCollator = new Intl.Collator("en");
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
				"url": "URL",
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
			options: function(fieldContainer){
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
	
	this.handleArticleLink = function(event)
	{
		let hash = event.target.hash;
		if(hash == "#")
			ipcRenderer.send("loadArticle", {});
		else if(hash.startsWith("##"))
			ipcRenderer.send("loadArticle", {title:event.target.innerHTML});
		else
			ipcRenderer.send("loadArticle", {id:hash.substring(1)});
	};
	
	this.handleCategoryLink = function(event)
	{
		let hash = event.target.hash;
		if(hash == "#")
			ipcRenderer.send("loadCategory", {});
		else if(hash.startsWith("##"))
			ipcRenderer.send("loadCategory", {id:hash.substring(2)});
		else
			ipcRenderer.send("loadCategory", {id:hash.substring(1)});
	};

	this.addArticleFields = function(data)
	{
		let content = $("#articlesContent");
		content.empty();
		let templateData = {
			categories: [],
		};
		// TODO: Show orphaned fields (if a category is removed from an article when it still had fields filled in, those are now orphaned.
		for(let c in data.categories)
		{
			// Determine template file for this category.
			let templateFile;
			if(c == "*")
				templateFile = "templates/"+ this.theme +"/article.all.articles.js";
			else
				templateFile = "templates/"+ this.theme +"/article."+ c +".js";
			
			// Register partial template from above file
			let partial;
			if(fs.existsSync(templateFile))
				partial = Handlebars.template(require("./"+ templateFile));
			else
				partial = Handlebars.template(require("./templates/"+ this.theme +"/article.default.category.js"));
			Handlebars.registerPartial("article."+c, partial);
			
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
		let template = Handlebars.template(require("./templates/"+ this.theme +"/article.js"));
		content.append(template(templateData));
		content.find(".articleDataContainer .articleDataEdit").each((index, element) => {
			if($(element).val() == "")
				$(element).parents(".articleDataContainer").removeClass("reading").addClass("editing");
		});
		
		// Add dynamic stuff.
		content.find(".articleDataContainer .edit").click((event) => {
			$(event.target).parents(".articleDataContainer").removeClass("reading").addClass("editing");
		});
		content.find("a[href^='#']").each((idx, node) => {
			if($(node).data("type") == "category")
				node.addEventListener("click", Renderer.handleCategoryLink);
			else
				node.addEventListener("click", Renderer.handleArticleLink);
			if(node.hash.startsWith("##"))
				node.classList.add("broken");
		});
		content.find(".articleAddCategory").autocomplete({
			source: Renderer.categoriesList,
			delay: 0,
		}).keydown(event => {
			if(event.keyCode == 13)
			{
				ipcRenderer.send("addArticleCategory", {
					articleID: data.f['*'].id,
					categoryList: Object.keys(data.categories),
					newTitle: event.target.value,
				});
				event.target.value = "";
			}
		});
		content.find(".articleSaveBtn").click(event => {
			let data = {f:{}};
			$(".articleDataEdit").each((idx, node) => {
				if(!data.f[$(node).data("category")])
					data.f[$(node).data("category")] = {};
				data.f[$(node).data("category")][$(node).data("field")] = $(node).val();
			});
			ipcRenderer.send("saveArticle", data);
		});
	};
	
	// Work-in-progress function.
	this.addCategoryFields = function(data)
	{
		let content = $("#categoriesContent");
		content.empty();
		let templateData = {
			options: this.categoryFieldOptions,
			data: data,
		};
		let template = Handlebars.template(require("./templates/"+ this.theme +"/category.js"));
		content.append(template(templateData));
		
		// Add dynamic stuff.
		/*content.find(".categorySaveBtn").click(event => {
			let newData = {f:{}};
			if(data.id)
				newData.id = data.id;
			else
				newData.t = document.getElementById("categoryTitle").value;
			if(newData.id || newData.t)
			{
				let dataElements = document.querySelectorAll(".categoryDataEdit");
				dataElements.forEach((node, idx, list) => {
					let field = node.field.value;
					if(field)
					{
						if(!newData.f[field])
							newData.f[field] = {};
						if(node.type == "checkbox")
						{
							if(node.checked)
								newData.f[field][node.name] = true;
						}
						else if(Renderer.categoryFieldOptions[node.name].type == "checkbox")
						{
							if(node.value)
								newData.f[field][node.name] = true;
						}
						else if(node.value)
							newData.f[field][node.name] = node.value;
					}
				});
				ipcRenderer.send("saveCategory", newData);
			}
		});*/
	};
})();

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
	link.addEventListener("click", Renderer.handleArticleLink);
	// Add all the articles.
	if(Array.isArray(list) && list.length)
	{
		Renderer.articleIndex = {};
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
			link.addEventListener("click", Renderer.handleArticleLink);
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
	link.addEventListener("click", Renderer.handleCategoryLink);
	// Add all the categories.
	if(Array.isArray(list) && list.length)
	{
		Renderer.categoriesList = [];
		Renderer.categoryIndex = {};
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
			link.addEventListener("click", Renderer.handleCategoryLink);
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
	addCategoryFields(data);
	//Renderer.addCategoryFields(data);
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

// TODO: Finish rewriting these in Renderer.addCategoryFields to use templates.
function addCategoryFields(data)
{
	let content = document.getElementById("categoriesContent");
	while(content.hasChildNodes())
		content.removeChild(content.firstChild);
	if(data.id)
		content.appendChild(document.createElement("h1")).innerHTML = "Category: "+ (data.t?data.t:data.id);
	else
	{
		let titleElem = content.appendChild(document.createElement("input"));
		titleElem.defaultValue = "";
		titleElem.value = "";
		titleElem.type = "text";
		titleElem.id = "categoryTitle";
		titleElem.placeholder = "Category Title";
	}
	
	let articles = [];
	for(let a in Renderer.articleIndex)
	{
		if(Renderer.articleIndex[a].c.indexOf(data.id) > -1)
			articles.push({id:a, t:Renderer.articleIndex[a].t});
	}
	articles.sort(Renderer.sortByTitle);
	let articleContainer = content.appendChild(document.createElement("div"));
	for(let i in articles)
	{
		let link = articleContainer.appendChild(document.createElement("a"));
		link.href = "#"+ articles[i].id;
		link.innerHTML = articles[i].t;
	}
	
	let categories = [];
	for(let c in Renderer.categoryIndex)
	{
		if(Renderer.categoryIndex[c].c.indexOf(data.id) > -1)
			categories.push({id:c, t:Renderer.categoryIndex[c].t});
	}
	categories.sort(Renderer.sortByTitle);
	let categoryContainer = content.appendChild(document.createElement("div"));
	for(let i in categories)
	{
		let link = categoryContainer.appendChild(document.createElement("a"));
		link.href = "#"+ categories[i].id;
		link.innerHTML = categories[i].t;
		link.dataset.type = "category";
	}
	
	let floor = content.appendChild(document.createElement("hr"));
	floor.classList.add("categoryFieldFloor");
	for(let f in data.f)
	{
		if(data.id == "*" && (f == "id" || f == "t"))
		{
			let idElem = content.insertBefore(document.createElement("input"), floor);
			idElem.type = "hidden";
			idElem.defaultValue = f;
			idElem.value = f;
			idElem.id = f+"_id";
			idElem.name = "id";
			idElem.classList.add("categoryIDField");
			
			for(let i in Renderer.categoryFieldOptions)
			{
				let elem = content.insertBefore(document.createElement("input"), floor);
				elem.id = f+"_"+i;
				elem.field = idElem;
				elem.name = i;
				elem.type = "hidden";
				elem.defaultValue = (data.f[f][i] ? data.f[f][i] : "");
				elem.value = (data.f[f][i] ? data.f[f][i] : "");
				elem.classList.add("categoryDataEdit");
			}
		}
		else
		{
			addCategoryField(content, f, data.f[f], floor);
		}
	}
	let categoryCategoriesContainer = content.appendChild(document.createElement("label"));
	categoryCategoriesContainer.classList.add("categoryCategoriesContainer");
	categoryCategoriesContainer.htmlFor = "categoryAddCategory";
	categoryCategoriesContainer.label = "Use this if you want all articles in this category to also automatically belong to another category. For example: All cities are locations, so the 'City' category should be in the 'Location' category.";
	let categoryCategoriesLabel = categoryCategoriesContainer.appendChild(document.createElement("b"));
	categoryCategoriesLabel.innerHTML = "Categories: ";
	let categoryCategories = categoryCategoriesContainer.appendChild(document.createElement("div"));
	categoryCategories.classList.add("categoryCategories");
	for(let i in data.c)
	{
		let link = categoryCategories.appendChild(document.createElement("a"));
		link.href = "#"+ data.c[i];
		link.innerHTML = Renderer.categoryIndex[data.c[i]].t;
		link.dataset.type = "category";
	}
	let categoryAddCategory = categoryCategories.appendChild(document.createElement("input"));
	categoryAddCategory.id = "categoryAddCategory";
	categoryAddCategory.classList.add("categoryAddCategory");
	
	$(content).find("a[href^='#']").each((idx, node) => {
		if($(node).data("type") == "category")
			node.addEventListener("click", Renderer.handleCategoryLink);
		else
			node.addEventListener("click", Renderer.handleArticleLink);
		if(node.hash.startsWith("##"))
			node.classList.add("broken");
	});
	$(content).find(".categoryAddCategory").autocomplete({
		source: Renderer.categoriesList,
		delay: 0,
	}).keydown(event => {
		if(event.keyCode == 13)
		{
			ipcRenderer.send("addCategoryCategory", {
				categoryID: data.id,
				categoryList: data.c,
				newTitle: event.target.value,
			});
			event.target.value = "";
		}
	});
		
	let add = document.createElement("input");
	add.type = "button";
	add.value = "Add Field";
	content.appendChild(add);
	add.addEventListener("click", event => {
		addCategoryField(content, "", {}, floor);
	});
	let save = document.createElement("input");
	save.type = "button";
	save.value = "Save Category";
	content.appendChild(save);
	save.addEventListener("click", event => {
		let newData = {f:{}};
		if(data.id)
			newData.id = data.id;
		else
			newData.t = document.getElementById("categoryTitle").value;
		if(newData.id || newData.t)
		{
			let dataElements = document.querySelectorAll(".categoryDataEdit");
			dataElements.forEach((node, idx, list) => {
				let field = node.field.value;
				if(field)
				{
					if(!newData.f[field])
						newData.f[field] = {};
					if(node.type == "checkbox")
					{
						if(node.checked)
							newData.f[field][node.name] = true;
					}
					else if(Renderer.categoryFieldOptions[node.name].type == "checkbox")
					{
						if(node.value)
							newData.f[field][node.name] = true;
					}
					else if(node.value)
						newData.f[field][node.name] = node.value;
				}
			});
			ipcRenderer.send("saveCategory", newData);
		}
	});
}

function addCategoryField(content, id, data, floor)
{
	let table = content.insertBefore(document.createElement("table"), floor);
	table.classList.add("categoryFieldContainer");
	let tbody = table.appendChild(document.createElement("tbody"));
	
	// Setup edit box.
	let caption = table.appendChild(document.createElement("caption"));
	let idElem = caption.appendChild(document.createElement("input"));
	if(id)
	{
		idElem.defaultValue = id;
		idElem.value = id;
	}
	else
	{
		id = document.querySelectorAll(".categoryIDField").length;
		idElem.defaultValue = "";
		idElem.value = "";
	}
	idElem.type = "text";
	idElem.id = id+"_id";
	idElem.name = "id";
	idElem.placeholder = "Unique Identifier";
	idElem.classList.add("categoryIDField");
	// TODO: If the id is changed after being created, every single article in this category needs to be updated.
	let deleteBtn = caption.appendChild(document.createElement("input"));
	deleteBtn.value = "X";
	deleteBtn.type = "button";
	deleteBtn.target = table;
	deleteBtn.addEventListener("click", event => {
		event.target.target.parentNode.removeChild(event.target.target);
	});
	
	for(let i in Renderer.categoryFieldOptions)
	{
		let tr = tbody.appendChild(document.createElement("tr"));
		tr.classList.add("categoryFieldOptionContainer");
		let th = tr.appendChild(document.createElement("th"));
		let label = th.appendChild(document.createElement("label"));
		label.htmlFor = id+"_"+i;
		label.innerHTML = Renderer.categoryFieldOptions[i].label+":";
		let td = tr.appendChild(document.createElement("td"));
		let elem;
		if(Renderer.categoryFieldOptions[i].type == "select")
		{
			elem = td.appendChild(document.createElement("select"));
			if(typeof(Renderer.categoryFieldOptions[i].options) == "function")
			{
				elem.optionsFunction = Renderer.categoryFieldOptions[i].options;
				elem.classList.add("dynamicOptions");
			}
			else
			{
				for(let o in Renderer.categoryFieldOptions[i].options)
				{
					let option = elem.appendChild(document.createElement("option"));
					option.value = o;
					option.innerHTML = Renderer.categoryFieldOptions[i].options[o];
				}
			}
			if(data[i])
			{
				elem.defaultValue = data[i];
				elem.value = data[i];
			}
			else
				elem.selectedIndex = 0;
		}
		else
		{
			elem = td.appendChild(document.createElement("input"));
			elem.type = Renderer.categoryFieldOptions[i].type;
			if(Renderer.categoryFieldOptions[i].type == "checkbox")
			{
				elem.value = "1";
				elem.checked = !!data[i];
			}
			else
			{
				if(data[i])
				{
					elem.defaultValue = data[i];
					elem.value = data[i];
				}
				else
				{
					elem.defaultValue = "";
					elem.value = "";
				}
			}
		}
		elem.id = id+"_"+i;
		elem.field = idElem;
		elem.name = i;
		elem.classList.add("categoryDataEdit", "field-"+i);
		if(Renderer.categoryFieldOptions[i].condition)
		{
			elem.condition = Renderer.categoryFieldOptions[i].condition;
			elem.classList.add("conditional");
		}
		if(Renderer.categoryFieldOptions[i].checkConditions)
		{
			elem.addEventListener("change", (event) => {
				checkConditions(table);
			});
		}
	}
	checkConditions(table);
}

function checkConditions(fieldContainer)
{
	$(fieldContainer).find(".conditional").each((index, element) => {
		let container = $(element).parents(".categoryFieldOptionContainer");
		if(element.condition(fieldContainer))
		{
			container.show();
			element.disabled = false;
		}
		else
		{
			container.hide();
			element.disabled = true;
		}
	});
	$(fieldContainer).find(".dynamicOptions").each((index, element) => {
		$(element).empty();
		let options = element.optionsFunction(fieldContainer);
		for(let o in options)
		{
			let option = element.appendChild(document.createElement("option"));
			option.value = o;
			option.innerHTML = options[o];
		}
		//if(element.namedItem(element.defaultValue))
			element.value = element.defaultValue;
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