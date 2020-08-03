"use strict";
const fs = require("fs");
const path = require("path");

/*
index.json should contain the minimum amount of information that should be loaded for every single article at all times.
	A reference to the meta/*.json file that contains this article's information.
meta/*.json should contain all article information except for the full text content, though it may contain that too in some cases. 
*/

module.exports = function(){
	this.init = async function(dataPath){
		this.dataPath = dataPath;
		this.indexFile = this.dataPath + path.sep +"index.json";
		await fs.promises.mkdir(this.dataPath + path.sep +"meta", {recursive:true});
		this.index = await this.loadJSON(this.indexFile);
	};
	
	// Loads JSON from the given file and returns the object. Creates the file with an empty JSON object if it doesn't exist.
	this.loadJSON = async function(file){
		try
		{
			return JSON.parse(await fs.promises.readFile(file));
		}
		catch(err)
		{
			if(err.code == "ENOENT")
			{
				await fs.promises.writeFile(file, "{}");
				return {};
			}
			else
				throw err;
		}
	};
	
	this.saveJSON = async function(file, object){
		return await fs.promises.writeFile(file, JSON.stringify(object));
	};
	
	this.loadArticle = async function(id){
		let metaData;
		try
		{
			metaData = await this.loadJSON(this.index.articleIndex[id].f);
		}
		catch(err)
		{
			console.error("Invalid id specified to load article:", id);
			return undefined;
		}
		if(metaData[id])
		{
			if(metaData[id].contentFile)
			{
				try
				{
					metaData[id].content = await fs.promises.readFile(metaData[id].contentFile, {
						encoding: "utf-8",
					});
				}
				catch(err)
				{
					console.error("Could not load article content from file:", metaData[id].contentFile);
				}
			}
			return metaData[id];
		}
		else
			return undefined;
	};
	
	this.saveArticle = async function(data, overwrite){
		let desiredID;
		if(data.id)
		{
			desiredID = data.id;
			delete data.id;
		}
		else
		{
			if(data.title)
				desiredID = this.convertToID(data.title);
			else if(data.contentFile)
				desiredID = "untitled-" + this.convertToID(data.contentFile);
			else if(data.content)
				desiredID = "untitled-" + this.generateHash(data.content);
			else
			{
				console.warn("An article must have either a title or content.");
				return false;
			}
		}
		let finalID = desiredID;
		if(!overwrite)
		{
			let inc = 2;
			while(this.index.articleIndex[finalID])
			{
				finalID = desiredID +"-"+ inc;
				inc++;
			}
		}
		let metaFile = this.dataPath + path.sep +"meta"+ path.sep + finalID.charAt(0) +".json";
		let metaJSON = await this.loadJSON(metaFile);
		if(!metaJSON[finalID])
			metaJSON[finalID] = data;
		else
		{
			for(let i in data)
				metaJSON[finalID][i] = data[i];
		}
		metaJSON[finalID].timeLastModified = Date.now()/1000;
		if(!metaJSON[finalID].timeCreated)
			metaJSON[finalID].timeCreated = metaJSON[finalID].timeLastModified;
		this.index.articleIndex[finalID] = {f:metaFile,t:metaJSON[finalID].title};
		if(metaJSON[finalID].contentFile)
		{
			// Check if file exists, and if we should overwrite it.
			// If not, change the file name.
			// Write content to file and remove the property from the JSON object.
		}
		await this.saveJSON(metaFile, metaJSON);
		await this.saveJSON(this.indexFile, this.index);
		return true;
	};
	
	this.loadCategory = function(id){
		return this.index.categoryIndex[id];
	};
	
	// TODO: Add a check somewhere to see if default category fields could conflict with other category fields. For example, if there's a category with the id "character" and a field "surname", and the default category has a field "character_surname", these will conflict, because the default fields have no prefix.
	this.saveCategory = async function(data, overwrite){
		let desiredID;
		if(data.id)
		{
			desiredID = data.id;
			delete data.id;
		}
		else
		{
			if(data.title)
				desiredID = this.convertToID(data.title);
			else
			{
				console.warn("A category must have a title.");
				return false;
			}
		}
		let finalID = desiredID;
		if(!overwrite)
		{
			let inc = 2;
			while(this.index.categoryIndex[finalID])
			{
				finalID = desiredID +"-"+ inc;
				inc++;
			}
		}
		if(!this.index.categoryIndex[finalID])
			this.index.categoryIndex[finalID] = data;
		else
		{
			for(let i in data)
			{
				// Keep in mind this overwrites the "f" property, so all existing fields will be deleted if they aren't in the new set.
				this.index.categoryIndex[finalID][i] = data[i];
			}
		}
		this.index.categoryIndex[finalID].timeLastModified = Date.now()/1000;
		if(!this.index.categoryIndex[finalID].timeCreated)
			this.index.categoryIndex[finalID].timeCreated = this.index.categoryIndex[finalID].timeLastModified;
		await this.saveJSON(this.indexFile, this.index);
		return true;
	};
	
	this.convertToID = function(string){
		return string.toLowerCase().replace(" ", "_").replace(/[\\\/]/g, "-").replace(/[^-a-z0-9_]/g, "");
	};
	
	this.generateHash = function(string){
		let hash = 0;
		for(let i=0; i<string.length; i++)
		{
			let chr = string.charCodeAt(i);
			hash = ((hash << 5) - hash) + chr;
			hash |= 0;
		}
		return hash;
	};
};
