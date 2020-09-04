module.exports={"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"articleDataContainer category"
    + ((stack1 = (lookupProperty(helpers,"ifeq")||(depth0 && lookupProperty(depth0,"ifeq"))||alias2).call(alias1,(depths[1] != null ? lookupProperty(depths[1],"id") : depths[1]),"*",{"name":"ifeq","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.program(4, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":2,"column":41},"end":{"line":2,"column":87}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = (lookupProperty(helpers,"ifeq")||(depth0 && lookupProperty(depth0,"ifeq"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"value") : depth0),"",{"name":"ifeq","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.program(8, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":2,"column":88},"end":{"line":2,"column":137}}})) != null ? stack1 : "")
    + "\" data-category-name=\""
    + alias3(container.lambda((depths[1] != null ? lookupProperty(depths[1],"title") : depths[1]), depth0))
    + "\" data-field-name=\""
    + alias3(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":2,"column":190},"end":{"line":2,"column":198}}}) : helper)))
    + "\">\n"
    + ((stack1 = (lookupProperty(helpers,"ifeq")||(depth0 && lookupProperty(depth0,"ifeq"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"type") : depth0),"select",{"name":"ifeq","hash":{},"fn":container.program(10, data, 0, blockParams, depths),"inverse":container.program(14, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":3,"column":0},"end":{"line":14,"column":9}}})) != null ? stack1 : "")
    + ((stack1 = (lookupProperty(helpers,"ifeq")||(depth0 && lookupProperty(depth0,"ifeq"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"type") : depth0),"hidden",{"name":"ifeq","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.program(19, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":15,"column":0},"end":{"line":21,"column":9}}})) != null ? stack1 : "")
    + "</div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "";
},"4":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "-"
    + container.escapeExpression(container.lambda((depths[1] != null ? lookupProperty(depths[1],"id") : depths[1]), depth0));
},"6":function(container,depth0,helpers,partials,data) {
    return "editing";
},"8":function(container,depth0,helpers,partials,data) {
    return "reading";
},"10":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=container.hooks.helperMissing, alias4="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "	<select class=\"articleDataEdit\" data-category=\""
    + alias1(container.lambda((depths[1] != null ? lookupProperty(depths[1],"id") : depths[1]), depth0))
    + "\" data-field=\""
    + alias1(((helper = (helper = lookupProperty(helpers,"field") || (depth0 != null ? lookupProperty(depth0,"field") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"field","hash":{},"data":data,"loc":{"start":{"line":4,"column":71},"end":{"line":4,"column":80}}}) : helper)))
    + "\" title=\""
    + alias1(((helper = (helper = lookupProperty(helpers,"description") || (depth0 != null ? lookupProperty(depth0,"description") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"description","hash":{},"data":data,"loc":{"start":{"line":4,"column":89},"end":{"line":4,"column":104}}}) : helper)))
    + "\">\n		<option value=\"\">Select "
    + alias1(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":5,"column":26},"end":{"line":5,"column":34}}}) : helper)))
    + "...</option>\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias2,(depth0 != null ? lookupProperty(depth0,"options") : depth0),{"name":"each","hash":{},"fn":container.program(11, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":0},"end":{"line":8,"column":9}}})) != null ? stack1 : "")
    + "	</select>\n";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "		<option value=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data,"loc":{"start":{"line":7,"column":17},"end":{"line":7,"column":26}}}) : helper)))
    + "\""
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"selected") : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":27},"end":{"line":7,"column":70}}})) != null ? stack1 : "")
    + ">"
    + alias4(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data,"loc":{"start":{"line":7,"column":71},"end":{"line":7,"column":80}}}) : helper)))
    + "</option>\n";
},"12":function(container,depth0,helpers,partials,data) {
    return " selected=\"selected\"";
},"14":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = (lookupProperty(helpers,"ifeq")||(depth0 && lookupProperty(depth0,"ifeq"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"type") : depth0),"textarea",{"name":"ifeq","hash":{},"fn":container.program(15, data, 0, blockParams, depths),"inverse":container.program(17, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":10,"column":0},"end":{"line":14,"column":0}}})) != null ? stack1 : "");
},"15":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "	<textarea placeholder=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":11,"column":24},"end":{"line":11,"column":32}}}) : helper)))
    + "\" class=\"articleDataEdit\" data-category=\""
    + alias4(container.lambda((depths[1] != null ? lookupProperty(depths[1],"id") : depths[1]), depth0))
    + "\" data-field=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"field") || (depth0 != null ? lookupProperty(depth0,"field") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"field","hash":{},"data":data,"loc":{"start":{"line":11,"column":96},"end":{"line":11,"column":105}}}) : helper)))
    + "\" title=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"description") || (depth0 != null ? lookupProperty(depth0,"description") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data,"loc":{"start":{"line":11,"column":114},"end":{"line":11,"column":129}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data,"loc":{"start":{"line":11,"column":131},"end":{"line":11,"column":140}}}) : helper)))
    + "</textarea>\n";
},"17":function(container,depth0,helpers,partials,data,blockParams,depths) {
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
    + alias4(container.lambda((depths[1] != null ? lookupProperty(depths[1],"id") : depths[1]), depth0))
    + "\" data-field=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"field") || (depth0 != null ? lookupProperty(depth0,"field") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"field","hash":{},"data":data,"loc":{"start":{"line":13,"column":127},"end":{"line":13,"column":136}}}) : helper)))
    + "\" title=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"description") || (depth0 != null ? lookupProperty(depth0,"description") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data,"loc":{"start":{"line":13,"column":145},"end":{"line":13,"column":160}}}) : helper)))
    + "\"/>\n";
},"19":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "	<div class=\"articleDataRead field-"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"field") || (depth0 != null ? lookupProperty(depth0,"field") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"field","hash":{},"data":data,"loc":{"start":{"line":17,"column":35},"end":{"line":17,"column":44}}}) : helper)))
    + "\">\n		"
    + ((stack1 = (lookupProperty(helpers,"unlesseq")||(depth0 && lookupProperty(depth0,"unlesseq"))||alias2).call(alias1,(depths[1] != null ? lookupProperty(depths[1],"id") : depths[1]),"*",{"name":"unlesseq","hash":{},"fn":container.program(20, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":18,"column":2},"end":{"line":18,"column":55}}})) != null ? stack1 : "")
    + "\n		"
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"valueParsed") || (depth0 != null ? lookupProperty(depth0,"valueParsed") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"valueParsed","hash":{},"data":data,"loc":{"start":{"line":19,"column":2},"end":{"line":19,"column":19}}}) : helper))) != null ? stack1 : "")
    + "\n	</div>\n";
},"20":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<b>"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"name","hash":{},"data":data,"loc":{"start":{"line":18,"column":28},"end":{"line":18,"column":36}}}) : helper)))
    + ": </b>";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"fields") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":23,"column":9}}})) != null ? stack1 : "");
},"useData":true,"useDepths":true}