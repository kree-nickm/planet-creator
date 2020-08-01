# Planet Creator (working title)
An application for creating TTRPG campaign settings and managing all information thereof.

### Installation
1. Install [Node.js](https://nodejs.org/en/download/). Make sure it is added to PATH or the below command won't work without tweaks.
2. Clone this repository into a directory of your choice, or simply download the files.
3. In that directory, run the command `npm install` to automatically install all of the Node.js dependencies.
4. Run the command `npm start` to start the application.

### Design Document
This is a loose design document for the features that are planned. Crossed-out items are effectively completed, though may still be tweaked.
* Add images for maps.
   * Allow map variations.
      * Knowledge-based variation, e.g. one map for a TTRPG GM where everything is revealed and labeled, and another for players where only certain things are revealed. This could be done with two separate maps, or with the GM layer being an overlay that includes the labels and additional information.
      * Time-based variation for displaying something as it looked at different time periods. E.g. one map for a city at the start of a TTRPG campaign, and one for the end of the campaign after half of it was turned into a crater.
      * Combination of the above two, with multiple maps for different amounts of the map being revealed, for TTRPG players learning more about the area over time. A fog-of-war feature is the typical example, but another one is adding different levels of detail to areas depending on player knowledge, rather than covering areas with a black blob.
   * Allow you to nest maps, so you can view an entire world’s map, then zoom into a city and have the view gradually transition into that city’s map, and then zoom into a building and have the view gradually transition into a playable grid map of that building, including the ability to cycle between floors of that building where applicable. Seamless transitions would be optimal, but having to manually select the zoomed-in area to switch to the zoomed-in map is also fine.
      * Maps should store some sort of relative location, like latitude and longitude, as well as scale, so they can be positioned properly for the seamless transitions.
      * Planets will also need a radius for proper 3D positioning of the maps it contains. This may be a pipe dream. Some universes might also have non-spherical planets.
      * Allow the map image and grid overlay to be rotated and scaled independently, and save the settings on a map-by-map basis, so that the grid overlay changes automatically to match up with each map when you switch between them.
   * Also include generic maps that do not represent a specific location, but rather can be inserted anywhere at will. For example:
      * A map of a ship on the water, that can be used manually whenever you need a map for something happening at sea.
      * A map of the interior of a house, that can be used automatically for every single house in part of a city, so that individual maps don’t have to be made for multiple identical locations.
   * Allow maps to be exported in a format that can be imported to Roll20 via R20ES. Perhaps other formats for other VTTs as well.
   * Likewise, if a map is exported via R20ES, allow it to be imported here
* Create articles for locations.
   * Include or link to maps of the location.
   * Also include non-map depictions of the location, like scenic views, etc.
   * Specify different types of locations.
      * Metaphysical, like planes of existence or separate universes.
      * Geographic, like planets, continents, mountain ranges, lakes, etc.
      * Geopolitical, like countries, states, provinces, cities, etc.
   * Specify and automatically link to parent/child locations, ie. have a larger region link to the smaller regions within it as well as the greater region that contains it.
      * Have separate hierarchies where applicable. E.g. Dublin is politically in the country of Ireland and geographically in the island of Ireland, but the island of Ireland is not the same as the country of Ireland, because Northern Ireland is actually part of the UK politically, so Dublin would need separate hierarchies for geographic and political.
* Create articles for characters. A character can be anything sentient, not just a person. Animals, monsters, gods, or even some plants may qualify for their own character article.
   * Allow various levels of specificity of the details of each character. Minor characters would only need a paragraph. Major NPCs in a TTRPG would need stat blocks or even full character sheets depending on the TTRPG system being used.
      * Allow the user to dynamically add new levels of specificity, as well as customize their own template for how the data is displayed.
      * Allow stat blocks to be exported in a format that can be imported to Roll20 via R20ES. Perhaps other formats for other VTTs as well.
      * Likewise, if a character is exported from R20ES, allow it to be imported here.
   * Include images of the character. Not only images for flavor, but also tokens that can be used to represent the character in a VTT.
   * Include sound recordings to keep track of what a character sounds like, for game masters of TTRPGs.
   * Loose dialogue trees for when players meet the character. A TTRPG shouldn’t have a strict dialogue tree like a video game, but you can still define pieces of it to help you improvise additional dialogue during the session.
* Create articles for groups of characters.
   * Political, like the people and government of a country.
   * Biological, like members of a subspecies or race.
   * Implicit, like groups of friends that are notable enough to have their own group name. Adventuring parties, etc.
* Create articles for events.
   * Include dates or date ranges so that the events can be tracked on a timeline.
   * Normally, character births or deaths and other events that are only related to one specific thing do not need their own event articles. However, if for example, a character’s death is part of a major battle, then that battle should have an event article, and the character’s article should link to this event article when specifying their death date.
* Other article types to make sure to support:
   * Inanimate objects that warrant description.
   * Summaries or notes from game sessions.
   * Homebrew TTRPG rules.
   * Laws of nature.
   * Metaphysical concepts and ideas, e.g. “what is magic”, “what is a soul”.
   * Miscellaneous notes that you don’t feel like categorizing; stream-of-consciousness ramblings.
* ~~Easily link between articles when one article needs to reference another. E.g. text that specifies the birthplace of a character links to the location article of said birthplace.~~
* Allow for intersection between different article types for extreme cases.
   * Is a sentient weapon an object or a character?
   * Is a miniature civilization contained inside a snowglobe, that can be carried around, a location or an object?
   * There’s no need to answer these questions. Make article types a kind of template that can be applied to an article, allowing multiple templates to be applied to one article when needed.
* Allow different levels of visibility to all articles. If you want other users to view your content, but not all of it, you should be able to decide what things someone can see.
   * Let the primary user set up their own access levels. Not a simple “GM level” and “player level”, but anything in between that they could want.
   * Let’s say you have four players able to see your content, but each one of them knows different things about a specific character. Each one of them should see a different version of that character’s article.
* Allow for describing things that may happen in the future, such as upcoming plot hooks in a TTRPG campaign. These could be a subset of event articles.
   * Decision trees. If the PCs in the TTRPG do certain things, then certain future events are caused, prevented or changed.
   * Save multiple states of decision trees. Imagine that you have multiple TTRPG games playing the same campaign, but not in the same universe/timeline/whatever, completely independant. Allow the user to show the state of the future events based on each game, or create an entirely new tree in a fresh state for a brand new game.
   * Allow for the same kind of format that you would see in an official D&D adventure module book.
* A timeline of events.
   * Automatically include all things that can be tracked by date or time period, including but not limited to:
      * Event articles.
      * Character births and deaths, fetched directly from the character’s article.
      * Formation and disbanding dates of political powers, based only on the article of that political power.
   * Filters for types of events. A timeline with every single thing ever is cool and all, but sometimes you only want to see births and deaths, or adventures completed by a specific group, etc.
   * For all articles that include a date, allow a reference instead. Don’t force the user to choose an exact date off the bat. They should be able to choose a range by specifying an event that happened before, and an event that happened after.
* Allow a way for a user to package their world in a way that can be distributed. Perhaps they want to release a campaign guide for their world. Allow them to create an article that copies various information of their choice from other articles into a very large PDF, for eventual release as a book.
* Allow for the interface to be customized. People switching to this from another planning method should be able to select an interface that most closely resembles their planning method.
   * Possibly allow automatic transferring from another note-taking app to this one. This obviously depends greatly on what the other app is capable of.
