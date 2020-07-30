"use strict";
const fs = require("fs");

module.exports = new function(){
	this.dataPath = "data";
	this.indexFile = this.dataPath +"/index.json";
	this.index = null;
	
	this.init = async function(){
		await fs.promises.mkdir(this.dataPath +"/meta", {recursive:true});
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
			else if(err.name == "SyntaxError" && err.message.indexOf("JSON") > -1)
			{
				console.error("Failed to parse '"+ file +"'. Error message was '"+ err.message +"'. At this time, the only recourse is to try to correct this JSON error yourself within the file and restart the application. In future versions, it will be possible to rebuild this file automatically. Full error details follow...");
				throw err;
			}
			else
				throw err;
		}
	};
	
	this.saveJSON = async function(file, object){
		return await fs.promises.writeFile(file, JSON.stringify(object));
	};
	
	this.createArticle = async function(data){
		let desiredID;
		if(data.title)
			desiredID = data.title
		else if(data.contentFile)
			desiredID = "untitled-" + data.contentFile;
		else if(data.content)
			desiredID = "untitled-" + this.generateHash(data.content);
		else
		{
			console.warn("An article must have either a title or content.");
			return false;
		}
		let finalID = desiredID;
		let inc = 2;
		while(this.index[finalID])
		{
			finalID = desiredID +"-"+ inc;
			inc++;
		}
		let metaFile = this.dataPath +"/meta/"+ finalID.charAt(0) +".json";
		let metaJSON = await this.loadJSON(metaFile);
		metaJSON[finalID] = data;
		this.index[finalID] = metaFile;
		await this.saveJSON(metaFile, metaJSON);
		await this.saveJSON(this.indexFile, this.index);
		return true;
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
