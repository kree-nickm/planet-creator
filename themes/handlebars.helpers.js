/* Use this file to define additional helpers that you want to use in your templates.
Don't remove any of the existing ones or the default templates will break.
See: https://handlebarsjs.com/guide/block-helpers.html for info on how to define helpers.
The 'tag' property is the first argument of Handlebars.registerHelper, 'fn' is the second.
*/
module.exports = [
	{
		tag: "categoryPartial",
		fn: function(categoryId, options) {
			if(arguments.length != 2)
			{
				console.error('categoryPartial requires exactly one argument');
				return "";
			}
			return "article."+categoryId;
		},
	},
	{
		tag: "ifeq",
		fn: function(variable, value, options) {
			if(arguments.length != 3)
			{
				console.error('#ifeq requires exactly two arguments');
				return "";
			}
			if(variable == value)
				return options.fn(this);
			else
				return options.inverse(this);
		},
	},
	{
		tag: "unlesseq",
		fn: function(variable, value, options) {
			if(arguments.length != 3)
			{
				console.error('#unlesseq requires exactly two arguments');
				return "";
			}
			if(variable != value)
				return options.fn(this);
			else
				return options.inverse(this);
		},
	},
	{
		tag: "iftype",
		fn: function(variable, value, options) {
			if(arguments.length != 3)
			{
				console.error('#iftype requires exactly two arguments');
				return "";
			}
			if(typeof(variable) == value)
				return options.fn(this);
			else
				return options.inverse(this);
		},
	},
	{
		tag: "unlesstype",
		fn: function(variable, value, options) {
			if(arguments.length != 3)
			{
				console.error('#unlesstype requires exactly two arguments');
				return "";
			}
			if(typeof(variable) != value)
				return options.fn(this);
			else
				return options.inverse(this);
		},
	},
];