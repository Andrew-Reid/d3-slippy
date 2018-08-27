# d3-slippy

*Experimental at this point. Structure likely to change*

The goal of `d3-slippy` is to minimize the interface with tile services and tile coordinates while making D3 maps. It achieves this goal by relying on a Mercator projection to place the tiles, allowing use of geographic coordinates throughout. In a sense `d3-slippy` is a modified generic D3 Mercator projection.


## General

### d3.slippy()

Returns a new slippy map projection.

### slippy.width(*width*) / slippy.height(*height*)

If width or height are provided, sets the width/height of the map. Unlike a typical D3 projection this is required to know how many tiles to display. If no argument is provided, returns the current width/height. Default height is 500 while default width is 960.

### slippy.size(*[width,height] or selection*)

A convenience method that sets both size and width. If the provided argument is a D3 selection, will set the dimensions of the map to match the dimensions of the selected element (most commonly used for the SVG holding the map). If the provided argument is not a D3 selection, d3-slippy assumes an array has been provided indicating width and height of the map respectively.

If no argument is provided, returns the current dimensions of the map.

### slippy.wrap(*wrap*)

Takes a true / false boolean value to determine if the tiles should be wrapped. Default is false.

### slippy.source(*source*)

Takes a geographical tile source in the form of a function, where the function returns a tile's address given x,y and z coordinates. For example:

```
function(d) {
   return "https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/"+d.z+"/"+d.x+"/"+d.y+".png";
}
```
      
If no argument is provided, returns the current source.
      
### slippy.attribution(*attribution*)

Can be provided an attribution line, more commonly used to return the attribution string when a tile set is provided using the `slippy.tileSet()` method.

### slippy.tileSet(*tileSet*)

The module offers some built in tile sources and attributions out of the box. This method takes one of the names of those tile sources and sets the appropriate tile source and attribution. Valid values are:

* `CartoDB_Positron`
* `CartoDB_PositronNoLabels`
* `CartoDB_PositronOnlyLabels`
* `CartoDB_DarkMatter`
* `CartoDB_DarkMatterNoLabels`
* `CartoDB_DarkMatterOnlyLabels`
* `CartoDB_Voyager`
* `ESRI_WorldTerrain`
* `ESRI_WorldShadedRelief`
* `ESRI_WorldPhysical`
* `ESRI_WorldStreetMap`
* `ESRI_WorldTopoMap`
* `ESRI_WorldImagery`
* `ESRI_OceanBasemap`
* `ESRI_NGWorld` (National Geographic)
* `ESRI_Gray`
* `OSM_Topo` (Open Streetmap)
* `OSM`
* `Stamen_Toner`
* `Stamen_TonerBackground`
* `Stamen_TonerLines`
* `Stamen_TonerLite`
* `Stamen_Terrain`
* `Stamen_TerrainBackground`
* `Stamen_TerrainLines`
* `Stamen_Watercolor`

These tile sets require an attribution, which can be accessed with `slippy.attribution()` after the tile set is specified.

And, of course, it is possible that the tile sets available may change. Tile sets offered are available as of August 2018.



























This is just experimental at this point. The goal is to minimize the interface with tile services and tile coordinates, allowing use of geographic coordinates only while reducing code needed to create a slippy map.

A demonstration of this experiment can be found [here](https://bl.ocks.org/Andrew-Reid/a956ff105e12915e71617ff0e469664e).

I won't be writing any documentation or explanatory notes until I'm more confident in the final form the module would take.
