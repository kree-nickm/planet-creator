module.exports={"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<input class=\"categoryIDField\" type=\"hidden\" value=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"fieldId") || (depth0 != null ? lookupProperty(depth0,"fieldId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fieldId","hash":{},"data":data,"loc":{"start":{"line":2,"column":52},"end":{"line":2,"column":63}}}) : helper)))
    + "\" id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"fieldId") || (depth0 != null ? lookupProperty(depth0,"fieldId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fieldId","hash":{},"data":data,"loc":{"start":{"line":2,"column":69},"end":{"line":2,"column":80}}}) : helper)))
    + "_id\" name=\"id\"/>\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"options") : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":0},"end":{"line":5,"column":9}}})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.escapeExpression, alias3=container.lambda, alias4=container.hooks.helperMissing, alias5="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<input class=\"categoryDataEdit\" type=\"hidden\" value=\""
    + alias2(lookupProperty(helpers,"lookup").call(alias1,(depths[1] != null ? lookupProperty(depths[1],"fieldData") : depths[1]),(data && lookupProperty(data,"key")),{"name":"lookup","hash":{},"data":data,"loc":{"start":{"line":4,"column":53},"end":{"line":4,"column":81}}}))
    + "\" id=\""
    + alias2(alias3((depths[1] != null ? lookupProperty(depths[1],"fieldId") : depths[1]), depth0))
    + "_"
    + alias2(((helper = (helper = lookupProperty(helpers,"key") || (data && lookupProperty(data,"key"))) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias1,{"name":"key","hash":{},"data":data,"loc":{"start":{"line":4,"column":102},"end":{"line":4,"column":110}}}) : helper)))
    + "\" name=\""
    + alias2(((helper = (helper = lookupProperty(helpers,"key") || (data && lookupProperty(data,"key"))) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias1,{"name":"key","hash":{},"data":data,"loc":{"start":{"line":4,"column":118},"end":{"line":4,"column":126}}}) : helper)))
    + "\" data-idfield=\""
    + alias2(alias3((depths[1] != null ? lookupProperty(depths[1],"fieldId") : depths[1]), depth0))
    + "_id\"/>\n";
},"4":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<table class=\"categoryFieldContainer\">\n	<caption>\n		<input type=\"text\" class=\"categoryIDField\" id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"fieldId") || (depth0 != null ? lookupProperty(depth0,"fieldId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fieldId","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":9,"column":49},"end":{"line":9,"column":60}}}) : helper)))
    + "_id\" value=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"fieldId") || (depth0 != null ? lookupProperty(depth0,"fieldId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fieldId","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":9,"column":72},"end":{"line":9,"column":83}}}) : helper)))
    + "\" name=\"id\" placeholder=\"Unique Identifier\"/>\n		<button class=\"categoryFieldRemoveBtn\">X</button>\n	</caption>\n	<tbody>\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"options") : depth0),{"name":"each","hash":{},"fn":container.program(5, data, 2, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":13,"column":1},"end":{"line":28,"column":10}}})) != null ? stack1 : "")
    + "	</tbody>\n</table>\n";
},"5":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3=container.lambda, alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "		<tr class=\"categoryFieldOptionContainer"
    + ((stack1 = (lookupProperty(helpers,"iftype")||(depth0 && lookupProperty(depth0,"iftype"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"condition") : depth0),"function",{"name":"iftype","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":14,"column":41},"end":{"line":14,"column":96}}})) != null ? stack1 : "")
    + "\" data-option=\""
    + alias4(alias3(blockParams[0][1], depth0))
    + "\">\n			<th><label for=\""
    + alias4(alias3((depths[1] != null ? lookupProperty(depths[1],"fieldId") : depths[1]), depth0))
    + "_"
    + alias4(alias3(blockParams[0][1], depth0))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"label","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":15,"column":48},"end":{"line":15,"column":57}}}) : helper)))
    + ":</label></th>\n			<td>\n"
    + ((stack1 = (lookupProperty(helpers,"ifeq")||(depth0 && lookupProperty(depth0,"ifeq"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"type") : depth0),"select",{"name":"ifeq","hash":{},"fn":container.program(8, data, 0, blockParams, depths),"inverse":container.program(17, data, 0, blockParams, depths),"data":data,"blockParams":blockParams,"loc":{"start":{"line":17,"column":3},"end":{"line":25,"column":12}}})) != null ? stack1 : "")
    + "			</td>\n		</tr>\n";
},"6":function(container,depth0,helpers,partials,data) {
    return " conditional";
},"8":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "			<select id=\""
    + alias2(alias1((depths[1] != null ? lookupProperty(depths[1],"fieldId") : depths[1]), depth0))
    + "_"
    + alias2(alias1(blockParams[1][1], depth0))
    + "\" class=\"categoryDataEdit field-"
    + alias2(alias1(blockParams[1][1], depth0))
    + ((stack1 = (lookupProperty(helpers,"iftype")||(depth0 && lookupProperty(depth0,"iftype"))||container.hooks.helperMissing).call(alias3,(depth0 != null ? lookupProperty(depth0,"optionsFunc") : depth0),"function",{"name":"iftype","hash":{},"fn":container.program(9, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":18,"column":86},"end":{"line":18,"column":146}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,(depth0 != null ? lookupProperty(depth0,"checkConditions") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":18,"column":146},"end":{"line":18,"column":184}}})) != null ? stack1 : "")
    + "\" data-idfield=\""
    + alias2(alias1((depths[1] != null ? lookupProperty(depths[1],"fieldId") : depths[1]), depth0))
    + "_id\" name=\""
    + alias2(alias1(blockParams[1][1], depth0))
    + "\" data-default=\""
    + alias2(lookupProperty(helpers,"lookup").call(alias3,(depths[1] != null ? lookupProperty(depths[1],"fieldData") : depths[1]),blockParams[1][1],{"name":"lookup","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":18,"column":253},"end":{"line":18,"column":285}}}))
    + "\">\n			"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,(depth0 != null ? lookupProperty(depth0,"options") : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":19,"column":3},"end":{"line":21,"column":19}}})) != null ? stack1 : "")
    + "\n			</select>\n";
},"9":function(container,depth0,helpers,partials,data) {
    return " dynamicOptions";
},"11":function(container,depth0,helpers,partials,data) {
    return " changer";
},"13":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"options") : depth0),{"name":"each","hash":{},"fn":container.program(14, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":19,"column":18},"end":{"line":21,"column":12}}})) != null ? stack1 : "");
},"14":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n				<option value=\""
    + alias3(((helper = (helper = lookupProperty(helpers,"key") || (data && lookupProperty(data,"key"))) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"key","hash":{},"data":data,"loc":{"start":{"line":20,"column":19},"end":{"line":20,"column":27}}}) : helper)))
    + "\""
    + ((stack1 = (lookupProperty(helpers,"ifeq")||(depth0 && lookupProperty(depth0,"ifeq"))||alias2).call(alias1,(data && lookupProperty(data,"key")),lookupProperty(helpers,"lookup").call(alias1,(depths[2] != null ? lookupProperty(depths[2],"fieldData") : depths[2]),blockParams[3][1],{"name":"lookup","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":20,"column":41},"end":{"line":20,"column":74}}}),{"name":"ifeq","hash":{},"fn":container.program(15, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":20,"column":28},"end":{"line":20,"column":94}}})) != null ? stack1 : "")
    + ">"
    + alias3(container.lambda(depth0, depth0))
    + "</option>\n			";
},"15":function(container,depth0,helpers,partials,data) {
    return " selected";
},"17":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "			<input id=\""
    + alias2(alias1((depths[1] != null ? lookupProperty(depths[1],"fieldId") : depths[1]), depth0))
    + "_"
    + alias2(alias1(blockParams[1][1], depth0))
    + "\" class=\"categoryDataEdit field-"
    + alias2(alias1(blockParams[1][1], depth0))
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,(depth0 != null ? lookupProperty(depth0,"checkConditions") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":24,"column":85},"end":{"line":24,"column":123}}})) != null ? stack1 : "")
    + "\" data-idfield=\""
    + alias2(alias1((depths[1] != null ? lookupProperty(depths[1],"fieldId") : depths[1]), depth0))
    + "_id\" type=\""
    + alias2(((helper = (helper = lookupProperty(helpers,"type") || (depth0 != null ? lookupProperty(depth0,"type") : depth0)) != null ? helper : alias4),(typeof helper === "function" ? helper.call(alias3,{"name":"type","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":24,"column":164},"end":{"line":24,"column":172}}}) : helper)))
    + "\" name=\""
    + alias2(alias1(blockParams[1][1], depth0))
    + "\" "
    + ((stack1 = (lookupProperty(helpers,"ifeq")||(depth0 && lookupProperty(depth0,"ifeq"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"type") : depth0),"checkbox",{"name":"ifeq","hash":{},"fn":container.program(18, data, 0, blockParams, depths),"inverse":container.program(21, data, 0, blockParams, depths),"data":data,"blockParams":blockParams,"loc":{"start":{"line":24,"column":194},"end":{"line":24,"column":338}}})) != null ? stack1 : "")
    + "/>\n";
},"18":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "value=\"1\""
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,lookupProperty(helpers,"lookup").call(alias1,(depths[1] != null ? lookupProperty(depths[1],"fieldData") : depths[1]),blockParams[2][1],{"name":"lookup","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":24,"column":234},"end":{"line":24,"column":264}}}),{"name":"if","hash":{},"fn":container.program(19, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":24,"column":228},"end":{"line":24,"column":281}}})) != null ? stack1 : "");
},"19":function(container,depth0,helpers,partials,data) {
    return " checked";
},"21":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "value=\""
    + container.escapeExpression(lookupProperty(helpers,"lookup").call(depth0 != null ? depth0 : (container.nullContext || {}),(depths[1] != null ? lookupProperty(depths[1],"fieldData") : depths[1]),blockParams[2][1],{"name":"lookup","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":24,"column":296},"end":{"line":24,"column":328}}}))
    + "\"";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"hidden") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.program(4, data, 0, blockParams, depths),"data":data,"blockParams":blockParams,"loc":{"start":{"line":1,"column":0},"end":{"line":31,"column":7}}})) != null ? stack1 : "");
},"useData":true,"useDepths":true,"useBlockParams":true}