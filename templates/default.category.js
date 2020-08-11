module.exports={"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"articleDataContainer reading\">\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isselect") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.program(6, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":3,"column":0},"end":{"line":14,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"unless").call(alias1,(depth0 != null ? lookupProperty(depth0,"ishidden") : depth0),{"name":"unless","hash":{},"fn":container.program(11, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":0},"end":{"line":20,"column":11}}})) != null ? stack1 : "")
    + "</div>\n";
},"2":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=container.hooks.helperMissing, alias4="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "	<select class=\"articleDataEdit\" data-category=\""
    + alias1(container.lambda((depths[1] != null ? lookupProperty(depths[1],"category") : depths[1]), depth0))
    + "\" data-field=\""
    + alias1(((helper = (helper = lookupProperty(helpers,"field") || (depth0 != null ? lookupProperty(depth0,"field") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"field","hash":{},"data":data,"loc":{"start":{"line":4,"column":77},"end":{"line":4,"column":86}}}) : helper)))
    + "\" title=\""
    + alias1(((helper = (helper = lookupProperty(helpers,"description") || (depth0 != null ? lookupProperty(depth0,"description") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"description","hash":{},"data":data,"loc":{"start":{"line":4,"column":95},"end":{"line":4,"column":110}}}) : helper)))
    + "\">\n		<option value=\"\">Select "
    + alias1(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":5,"column":26},"end":{"line":5,"column":34}}}) : helper)))
    + "...</option>\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias2,(depth0 != null ? lookupProperty(depth0,"options") : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":0},"end":{"line":8,"column":9}}})) != null ? stack1 : "")
    + "	</select>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "		<option value=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data,"loc":{"start":{"line":7,"column":17},"end":{"line":7,"column":26}}}) : helper)))
    + "\""
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"selected") : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":27},"end":{"line":7,"column":70}}})) != null ? stack1 : "")
    + ">"
    + alias4(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data,"loc":{"start":{"line":7,"column":71},"end":{"line":7,"column":80}}}) : helper)))
    + "</option>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return " selected=\"selected\"";
},"6":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"istextarea") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.program(9, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":10,"column":0},"end":{"line":14,"column":0}}})) != null ? stack1 : "");
},"7":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "	<textarea placeholder=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":11,"column":24},"end":{"line":11,"column":32}}}) : helper)))
    + "\" class=\"articleDataEdit\" data-category=\""
    + alias4(container.lambda((depths[1] != null ? lookupProperty(depths[1],"category") : depths[1]), depth0))
    + "\" data-field=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"field") || (depth0 != null ? lookupProperty(depth0,"field") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"field","hash":{},"data":data,"loc":{"start":{"line":11,"column":102},"end":{"line":11,"column":111}}}) : helper)))
    + "\" title=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"description") || (depth0 != null ? lookupProperty(depth0,"description") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data,"loc":{"start":{"line":11,"column":120},"end":{"line":11,"column":135}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data,"loc":{"start":{"line":11,"column":137},"end":{"line":11,"column":146}}}) : helper)))
    + "</textarea>\n";
},"9":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "	<input type=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"type") || (depth0 != null ? lookupProperty(depth0,"type") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data,"loc":{"start":{"line":13,"column":14},"end":{"line":13,"column":22}}}) : helper)))
    + "\" value=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data,"loc":{"start":{"line":13,"column":31},"end":{"line":13,"column":40}}}) : helper)))
    + "\" placeholder=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":13,"column":55},"end":{"line":13,"column":63}}}) : helper)))
    + "\" class=\"articleDataEdit\" data-category=\""
    + alias4(container.lambda((depths[1] != null ? lookupProperty(depths[1],"category") : depths[1]), depth0))
    + "\" data-field=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"field") || (depth0 != null ? lookupProperty(depth0,"field") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"field","hash":{},"data":data,"loc":{"start":{"line":13,"column":133},"end":{"line":13,"column":142}}}) : helper)))
    + "\" title=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"description") || (depth0 != null ? lookupProperty(depth0,"description") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data,"loc":{"start":{"line":13,"column":151},"end":{"line":13,"column":166}}}) : helper)))
    + "\"/>\n";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "	<div class=\"articleDataRead\">\n		<button class=\"edit\">edit</button>\n		<span>"
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"valueParsed") || (depth0 != null ? lookupProperty(depth0,"valueParsed") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"valueParsed","hash":{},"data":data,"loc":{"start":{"line":18,"column":8},"end":{"line":18,"column":25}}}) : helper))) != null ? stack1 : "")
    + "</span>\n	</div>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"fields") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":22,"column":9}}})) != null ? stack1 : "");
},"useData":true,"useDepths":true}