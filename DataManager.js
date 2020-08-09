"use strict";
const fs = require("fs");
const path = require("path");

/*
setting.json should contain the minimum amount of information that should be loaded for every single article at all times.
	A reference to the *meta/*.json file that contains this article's information.
*meta/*.json should contain all article information except for the full text content, though it may contain that too in some cases. 
*/

module.exports = function(){
	this.minimumDefaultCategory = {
		a:0,
		z:0,
		t:"Default",
		f:{
			id:{n:"Identifier",t:"hidden"},
			t:{n:"Title",t:"text"}
		}
	};
	this.minimumArticle = {
		a:0,
		z:0,
		f:{'*':{}},
		c:["*"]
	};
	
	this.init = async function(dataFile){
		this.indexFile = dataFile;
		this.dataPath = path.dirname(this.indexFile);
		await fs.promises.mkdir(this.dataPath + path.sep +"articlemeta", {recursive:true});
		await fs.promises.mkdir(this.dataPath + path.sep +"categorymeta", {recursive:true});
		this.index = await this.loadJSON(this.indexFile);
		// This is similar to 
		if(!this.index.ai)
			this.index.ai = {};
		if(!this.index.ci)
			this.index.ci = {};
		if(!this.index.ci["*"])
			this.index.ci["*"] = {f:{c:{t:"textarea",n:"Content",m:1}}};
		// Note: We only want to add 'c' if '*' was empty, not re-add it if it was removed from '*'.
		this.verifyData(this.index.ci["*"], this.minimumDefaultCategory);
	};
	
	this.verifyData = function(givenData, minimumData){
		for(let i in minimumData)
		{
			if(Array.isArray(minimumData[i]))
			{
				if(!Array.isArray(givenData[i]))
					givenData[i] = [];
				this.verifyData(givenData[i], minimumData[i]);
			}
			else if(typeof(minimumData[i]) == "object")
			{
				if(!givenData[i])
					givenData[i] = {};
				this.verifyData(givenData[i], minimumData[i]);
			}
			else if(Array.isArray(minimumData) && givenData.indexOf(minimumData[i]) == -1)
			{
				givenData.push(minimumData[i]);
			}
			else if(!Array.isArray(minimumData) && !givenData[i])
			{
				givenData[i] = minimumData[i];
			}
		}
	}
	
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
	
	this.loadData = async function(id, category){
		let index;
		if(category)
		{
			if(id == "*")
				return this.index.ci["*"];
			else
				index = this.index.ci;
		}
		else
			index = this.index.ai;
		let metaData;
		try
		{
			metaData = await this.loadJSON(index[id].f);
		}
		catch(err)
		{
			console.error("Invalid id specified to load "+ (category?"category":"article") +": "+ id);
			return undefined;
		}
		if(metaData[id] && metaData[id].f)
		{
			if(!category)
			{
				this.verifyData(metaData[id], this.minimumArticle);
				for(let c in metaData[id].f)
				{
					for(let f in metaData[id].f[c])
					{
						if(f.endsWith(":File"))
						{
							let newF = f.substring(0, f.length-5);
							try
							{
								metaData[id].f[c][newF] = await fs.promises.readFile(metaData[id].f[c][f], {encoding:"utf-8"});
							}
							catch(err)
							{
								console.error("Could not load content from file: "+ metaData[id].f[c][f]);
							}
						}
					}
				}
				if(!metaData[id].f['*'].t)
					metaData[id].f['*'].t = id;
			}
			return metaData[id];
		}
		else
			return undefined;
	};
	
	this.saveData = async function(data, category, overwrite){
		// Determine the index to use as the initial ID.
		let index;
		let desiredID;
		if(category)
		{
			index = this.index.ci;
			if(data.id)
			{
				desiredID = data.id;
				delete data.id;
			}
			else
			{
				if(data.t)
					desiredID = this.convertToID(data.t);
				else
				{
					console.warn("A category must have a title.");
					return false;
				}
			}
		}
		else
		{
			index = this.index.ai;
			if(data.f['*'].id)
			{
				desiredID = data.f['*'].id;
				delete data.f['*'].id;
			}
			else
			{
				if(data.f['*'].t)
					desiredID = this.convertToID(data.f['*'].t);
				else
				{
					// TODO: Allow any field, not just title..
					console.warn("An article must have a title.");
					return false;
				}
			}
		}
		
		// Determine the ID we're going to use, in case we need to make a new one to avoid overwriting.
		let finalID = desiredID;
		if(!overwrite)
		{
			let inc = 2;
			while(index[finalID])
			{
				finalID = desiredID +"-"+ inc;
				inc++;
			}
		}
		
		// Build the meta object.
		let metaFile;
		let metaJSON;
		if(category && finalID == "*")
		{
			metaJSON = this.index.ci;
		}
		else
		{
			if(index[finalID] && index[finalID].f)
				metaFile = index[finalID].f;
			else
				metaFile = this.dataPath + path.sep + (category?"category":"article") +"meta"+ path.sep + finalID.charAt(0) +".json";
			metaJSON = await this.loadJSON(metaFile);
		}
		if(!metaJSON[finalID])
			metaJSON[finalID] = data;
		else if(category)
		{
			if(data.t)
				metaJSON[finalID].t = data.t;
			if(data.f)
				metaJSON[finalID].f = data.f;
		}
		else
		{
			if(data.f)
			{
				if(metaJSON[finalID].f)
				{
					for(let c in data.f)
					{
						if(metaJSON[finalID].f[c])
						{
							for(let f in data.f[c])
							{
								metaJSON[finalID].f[c][f] = data.f[c][f];
							}
						}
						else
							metaJSON[finalID].f[c] = data.f[c];
					}
				}
				else
					metaJSON[finalID].f = data.f;
			}
			if(data.c)
				metaJSON[finalID].c = data.c;
		}
		metaJSON[finalID].z = Date.now()/1000;
		if(!metaJSON[finalID].a)
			metaJSON[finalID].a = metaJSON[finalID].z;
		
		// Handle fields that get saved to a file.
		if(category)
		{
			if(finalID == "*")
				this.verifyData(metaJSON[finalID], this.minimumDefaultCategory);
			if(metaFile)
				index[finalID] = {f:metaFile,t:metaJSON[finalID].t};
		}
		else
		{
			for(let c in metaJSON[finalID].f)
			{
				for(let f in metaJSON[finalID].f[c])
				{
					if(f.endsWith(":File"))
					{
						let newF = f.substring(0, f.length-5);
						let desiredFile = metaJSON[finalID].f[c][f];
						let finalFile = desiredFile;
						if(!overwrite)
						{
							let inc = 2;
							let isFile = true;
							while(isFile)
							{
								try
								{
									isFile = await fs.promises.stat(finalFile);
									finalFile = desiredFile +"-"+ inc;
									inc++;
								}
								catch(err)
								{
									isFile = false;
								}
							}
						}
						try
						{
							await fs.promises.writeFile(finalFile, metaJSON[finalID].f[c][newF]);
							metaJSON[finalID].f[c][f] = finalFile;
							delete metaJSON[finalID].f[c][newF];
						}
						catch(err)
						{
							console.error("Unable to write content to file: "+ finalFile);
						}
					}
				}
			}
			this.verifyData(metaJSON[finalID], this.minimumArticle);
			if(metaFile)
				index[finalID] = {f:metaFile,t:metaJSON[finalID].f['*'].t};
		}
		
		// Save the JSON files.
		if(metaFile)
			await this.saveJSON(metaFile, metaJSON);
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
