module.exports={"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<h1>"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"data") : depth0)) != null ? lookupProperty(stack1,"t") : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data,"loc":{"start":{"line":3,"column":4},"end":{"line":3,"column":54}}})) != null ? stack1 : "")
    + "</h1>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"data") : depth0)) != null ? lookupProperty(stack1,"t") : stack1), depth0));
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"data") : depth0)) != null ? lookupProperty(stack1,"id") : stack1), depth0));
},"6":function(container,depth0,helpers,partials,data) {
    return "<input value=\"\" type=\"text\" id=\"categoryTitle\" placeholder=\"Category Title\"/>\n";
},"8":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<table>\n	<caption>\n		<input class=\"categoryIDField\" id=\""
    + alias2(alias1(blockParams[0][1], depth0))
    + "_id\" value=\""
    + alias2(alias1(blockParams[0][1], depth0))
    + "\" name=\"id\" placeholder=\"Unique Identifier\"/>\n		<button class=\"categoryFieldRemoveBtn\">X</button>\n	</caption>\n	<tbody>\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depths[1] != null ? lookupProperty(depths[1],"options") : depths[1]),{"name":"each","hash":{},"fn":container.program(9, data, 2, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":14,"column":1},"end":{"line":25,"column":10}}})) != null ? stack1 : "")
    + "	</tbody>\n</table>\n";
},"9":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "		<tr class=\"categoryFieldOptionContainer\">\n			<th><label for=\""
    + alias2(alias1(blockParams[1][1], depth0))
    + "_"
    + alias2(alias1(blockParams[0][1], depth0))
    + "\">"
    + alias2(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : alias4),(typeof helper === "function" ? helper.call(alias3,{"name":"label","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":16,"column":45},"end":{"line":16,"column":54}}}) : helper)))
    + ":</label></th>\n			<td>\n"
    + ((stack1 = (lookupProperty(helpers,"ifeq")||(depth0 && lookupProperty(depth0,"ifeq"))||alias4).call(alias3,(depth0 != null ? lookupProperty(depth0,"type") : depth0),"select",{"name":"ifeq","hash":{},"fn":container.program(10, data, 0, blockParams),"inverse":container.program(12, data, 0, blockParams),"data":data,"blockParams":blockParams,"loc":{"start":{"line":18,"column":3},"end":{"line":22,"column":12}}})) != null ? stack1 : "")
    + "			</td>\n		</tr>\n";
},"10":function(container,depth0,helpers,partials,data) {
    return "			<select>\n			</select>\n";
},"12":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"data") : depth0)) != null ? lookupProperty(stack1,"id") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.program(6, data, 0, blockParams, depths),"data":data,"blockParams":blockParams,"loc":{"start":{"line":2,"column":0},"end":{"line":6,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"data") : depth0)) != null ? lookupProperty(stack1,"f") : stack1),{"name":"each","hash":{},"fn":container.program(8, data, 2, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":7,"column":0},"end":{"line":28,"column":9}}})) != null ? stack1 : "")
    + "<hr/>\n<button class=\"categoryFieldAddBtn\">Add Field</button>\n<button class=\"categorySaveBtn\">Save Category</button>";
},"useData":true,"useDepths":true,"useBlockParams":true}