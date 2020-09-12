module.exports = {
	afterArticleContent: function(content, data) {
		content.find(".articleDataContainer").contextmenu(event => {
			let target = $(event.currentTarget);
			if(target.hasClass("reading"))
			{
				Renderer.addToContextMenu(
					"pencil",
					"Edit "+ target.data("field-name") +" ("+ target.data("category-name") +")",
					event => {
						target.removeClass("reading").addClass("editing");
					},
					true
				);
			}
		});
		content.find(".articleCategories a").contextmenu(event => {
			let target = $(event.currentTarget);
			Renderer.addToContextMenu(
				"trash",
				"Remove From \""+ target.html() +"\"",
				event => {
					Renderer.send("editCategorization", {
						articleID: data.f['*'].id,
						categoryList: Object.keys(data.categories),
						removeId: target[0].hash.substring(1),
					});
				},
				true
			);
		});
		content.find(".articleAddCategory").autocomplete({
			source: Renderer.categoriesList,
			delay: 0,
		}).keydown(event => {
			if(event.keyCode == 13)
			{
				Renderer.send("editCategorization", {
					articleID: data.f['*'].id,
					categoryList: Object.keys(data.categories),
					newTitle: event.currentTarget.value,
				});
				event.currentTarget.value = "";
			}
		});
		content.find(".articleSaveBtn").click(event => {
			let data = {f:{}};
			$(".articleDataEdit").each((idx, node) => {
				if(!data.f[$(node).data("category")])
					data.f[$(node).data("category")] = {};
				data.f[$(node).data("category")][$(node).data("field")] = $(node).val();
			});
			Renderer.send("saveArticle", data);
		});
	},
	
	afterCategoryContent: function(content, data) {
		let template = Renderer.loadTemplate("themes/default/templates/category.field.js")
		let floor = $("#categoryFieldFloor");
		
		let checkConditions = function(fieldContainer) {
			$(fieldContainer).find(".conditional").each((index, element) => {
				let container = $(element);
				let condition = Renderer.categoryFieldOptions[container.data("option")].condition;
				if(typeof(condition) == "function")
				{
					if(condition(fieldContainer))
					{
						container.show();
						container.find("input,select,button").prop("disabled", false);
					}
					else
					{
						container.hide();
						container.find("input,select,button").prop("disabled", true);
					}
				}
			});
			$(fieldContainer).find(".dynamicOptions").each((index, element) => {
				let optionsFunction = Renderer.categoryFieldOptions[element.name].optionsFunc;
				if(typeof(optionsFunction) == "function")
				{
					$(element).empty();
					let options = optionsFunction(fieldContainer);
					for(let o in options)
					{
						let option = element.appendChild(document.createElement("option"));
						option.value = o;
						option.innerHTML = options[o];
					}
					element.value = $(element).data("default");
				}
			});
		};
		
		let addCategoryField = function(fieldId, fieldData) {
			floor.before(template({
				hidden: data.id == "*" && (fieldId == "id" || fieldId == "t"),
				category: data.id,
				options: Renderer.categoryFieldOptions,
				fieldId: fieldId,
				fieldData: fieldData,
			}));
			$(".categoryFieldRemoveBtn").click(event => {
				$(event.currentTarget).parents(".categoryFieldContainer").remove();
			});
			$(".changer").change(event => {
				checkConditions($(event.currentTarget).parents(".categoryFieldContainer")[0]);
			});
			$(".categoryFieldContainer").each((idx, elem) => {
				checkConditions(elem);
			});
		};
		
		for(let f in data.f)
		{
			addCategoryField(f, data.f[f]);
		}
		
		content.find(".categoryFieldAddBtn").click(event => {
			addCategoryField($(".categoryIDField").length, {});
		});
		
		content.find(".categoryCategories a").contextmenu(event => {
			let target = $(event.currentTarget);
			Renderer.addToContextMenu(
				"trash",
				"Remove From \""+ target.html() +"\"",
				event => {
					Renderer.send("editCategorization", {
						categoryID: data.id,
						categoryList: data.c,
						removeId: target[0].hash.substring(1),
					});
				},
				true
			);
		});
		content.find(".categoryAddCategory").autocomplete({
			source: Renderer.categoriesList,
			delay: 0,
		}).keydown(event => {
			if(event.keyCode == 13)
			{
				Renderer.send("editCategorization", {
					categoryID: data.id,
					categoryList: data.c,
					newTitle: event.currentTarget.value,
				});
				event.currentTarget.value = "";
			}
		});
		
		content.find(".categorySaveBtn").click(event => {
			let newData = {f:{}};
			if(data.id)
				newData.id = data.id;
			else
				newData.t = $("#categoryTitle").val();
			if(newData.id || newData.t)
			{
				let dataElements = $(".categoryDataEdit");
				dataElements.each((idx, elem) => {
					let field = document.getElementById($(elem).data("idfield")).value;
					if(field)
					{
						if(!newData.f[field])
							newData.f[field] = {};
						if(elem.type == "checkbox")
						{
							if(elem.checked)
								newData.f[field][elem.name] = true;
						}
						else if(Renderer.categoryFieldOptions[elem.name].type == "checkbox")
						{
							if(elem.value)
								newData.f[field][elem.name] = true;
						}
						else if(elem.value)
							newData.f[field][elem.name] = elem.value;
					}
				});
				Renderer.send("saveCategory", newData);
			}
		});
	},
};
