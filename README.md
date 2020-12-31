# d3-slippy

*Very Experimental at this point - coming along, but a ways to go. Structure likely to change without warning*

The goal of `d3-slippy` is to minimize the interface with tile services and tile coordinates while making D3 maps. It achieves this goal by relying on a Mercator projection to place the tiles, allowing use of geographic coordinates throughout. In a sense `d3-slippy` is a modified generic D3 Mercator projection.

<a href="https://bl.ocks.org/Andrew-Reid/3b1fb5ce8957dab2e3f5042931dddf6c"><img src="demo1.png"/></a>


## General

### d3.slippy()

Returns a new slippy map projection.

### slippy.width(*width*) / slippy.height(*height*)

If width or height are provided, sets the width/height of the map. Unlike a typical D3 projection this is required to know how many tiles to display. If no argument is provided, returns the current width/height. Default height is 500 while default width is 960.

### slippy.size(*[width,height] or selection or element*)

A convenience method that sets both size and width. If the provided argument is a D3 selection, will set the dimensions of the map to match the dimensions of the selected element (most commonly used for the SVG holding the map). If the provided element is an SVG element, will set the dimensions of the map to match the dimensions of the provided element. If the provided argument is not a D3 selection, d3-slippy assumes an array has been provided indicating width and height of the map respectively.

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

### slippy.xyz(*true/false*)

If provided false, the tiles will be assumed to be of a TMS layout scheme (such as those tiles produced by TileMill). If true (the default), the tiling will be xyz (most tile sources). By default this is set to true.

### slippy.tileSet(*tileSet*)

Takes an object representing a tileset. The tile object can include properties for:

* `attribution` : The appropriate attribution string for the tile set.
* `source`: A function to access the actual tiles, eg:
```
function(d) {
   return "https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/"+d.z+"/"+d.x+"/"+d.y+".png";
}
```
* `projection` : The appropriate projection for the tile set (in the form of a d3 projection)
* `tileSize` : The width in pixels of tiles in the source, default is 256 (for 256x256 tiles)
* `minDepth` : The minimum tile depth for which tiles exist, default is 1
* `maxDepth` : The maximum tile depth for which tiles exist, default is 13
* `wrap` : Boolean for if tiles should be wrapped, default is false
* `xyz` : Boolean for if tiles are structured in XYZ or TMS schemes, default is true
* `limit` : The most extreme latitude, in degrees, represented on the map, defaults to 85.05113

All of these are technically optional - however, source would typically be provided, as the default is OSM. *Setting a tileset may alter slippy and/or projection properties from intended values if they were set manually prior to assigning a tileset, for example assigning a tileset may change wrap settings that were previously specified.*

As part of d3-slippy, There are tileset objects in `d3.tileSet`, these are as follows:

* `d3.tileSet.CartoDB_Positron`

<img src="https://raw.githubusercontent.com/Andrew-Reid/d3-slippy/master/images/tiles/CartoDB_Positron.png" width=400 height=200></img>

* `d3.tileSet.CartoDB_PositronNoLabels`
* `d3.tileSet.CartoDB_PositronOnlyLabels`
* `d3.tileSet.CartoDB_DarkMatter`

<img src="https://raw.githubusercontent.com/Andrew-Reid/d3-slippy/master/images/tiles/CartoDB_DarkMatter.png" width=400 height=200></img>

* `CartoDB_DarkMatterNoLabels`
* `CartoDB_DarkMatterOnlyLabels`
* `CartoDB_Voyager`

<img src="https://raw.githubusercontent.com/Andrew-Reid/d3-slippy/master/images/tiles/CartoDB_Voyager.png" width=400 height=200></img>

* `ESRI_WorldTerrain`

<img src="https://raw.githubusercontent.com/Andrew-Reid/d3-slippy/master/images/tiles/ESRI_WorldTerrain.png" width=400 height=200></img>

* `ESRI_WorldShadedRelief`

<img src="https://raw.githubusercontent.com/Andrew-Reid/d3-slippy/master/images/tiles/ESRI_WorldShadedRelief.png" width=400 height=200></img>

* `ESRI_WorldPhysical`

<img src="https://raw.githubusercontent.com/Andrew-Reid/d3-slippy/master/images/tiles/ESRI_WorldPhysical.png" width=400 height=200></img>

* `ESRI_WorldStreetMap`

<img src="https://raw.githubusercontent.com/Andrew-Reid/d3-slippy/master/images/tiles/ESRI_WorldStreetMap.png" width=400 height=200></img>

* `ESRI_WorldTopoMap`

<img src="https://raw.githubusercontent.com/Andrew-Reid/d3-slippy/master/images/tiles/ESRI_WorldTopoMap.png" width=400 height=200></img>

* `ESRI_WorldImagery`

<img src="https://raw.githubusercontent.com/Andrew-Reid/d3-slippy/master/images/tiles/ESRI_WorldImagery.png" width=400 height=200></img>

* `ESRI_OceanBasemap`

<img src="https://raw.githubusercontent.com/Andrew-Reid/d3-slippy/master/images/tiles/ESRI_OceanBasemap.png" width=400 height=200></img>

* `ESRI_NGWorld` (National Geographic)

<img src="https://raw.githubusercontent.com/Andrew-Reid/d3-slippy/master/images/tiles/ESRI_NGWorld.png" width=400 height=200></img>

* `ESRI_Gray`

<img src="https://raw.githubusercontent.com/Andrew-Reid/d3-slippy/master/images/tiles/ESRI_Gray.png" width=400 height=200></img>

* `OSM_Topo` (Open Streetmap)

<img src="https://raw.githubusercontent.com/Andrew-Reid/d3-slippy/master/images/tiles/OSM_Topo.png" width=400 height=200></img>

* `OSM`

<img src="https://raw.githubusercontent.com/Andrew-Reid/d3-slippy/master/images/tiles/OSM.png" width=400 height=200></img>

* `Stamen_Toner`

<img src="https://raw.githubusercontent.com/Andrew-Reid/d3-slippy/master/images/tiles/Stamen_Toner.png" width=400 height=200></img>

* `Stamen_TonerBackground`



* `Stamen_TonerLines`



* `Stamen_TonerLite`

<img src="https://raw.githubusercontent.com/Andrew-Reid/d3-slippy/master/images/tiles/Stamen_TonerLite.png" width=400 height=200></img>

* `Stamen_Terrain`

<img src="https://raw.githubusercontent.com/Andrew-Reid/d3-slippy/master/images/tiles/Stamen_Terrain.png" width=400 height=200></img>

* `Stamen_TerrainBackground`

<img src="https://raw.githubusercontent.com/Andrew-Reid/d3-slippy/master/images/tiles/Stamen_TerrainBackground.png" width=400 height=200></img>

* `Stamen_TerrainLines`
* `Stamen_Watercolor`

<img src="https://raw.githubusercontent.com/Andrew-Reid/d3-slippy/master/images/tiles/Stamen_Watercolor.png" width=400 height=200></img>

And, of course, it is possible that the tile sets available may change. Tile sets offered are available as of February 2019. See attribution details below.

### Attribution

Most tile sets, and all those with built in objects, require attribution, which can be accessed with `slippy.attribution()` after the tile set is specified. Check with tile providers for the specifics of attribution.

## Projection Methods

These methods alter the projection behind `d3-slippy`, *the distinction between "projection" and "zoom" methods is one that I am not particularily satisfied with and may be subject to change.*

### slippy.projection(*projection*)

Takes a d3 projection - intended to be used to match a projection to a tile set.

### slippy.invert(*[x,y]*)

Same as a D3-geoprojection, takes an SVG coordinate in pixels and returns a geographic coordinate ([longitude,latitude]).

### slippy.center(*[longitude,latitude]*)

Almost the same as a D3-geoprojection, takes a geographic coordinate ([longitude,latitude]) and places the map center at this location.  Differs D3-geoprojections in that the center coordinate is a typical latitude/longitude, and not affected by any projection rotation. *Map size must be correct for the center to be placed properly.* 

### slippy.scale(*scale*)

Largely the same as a D3 geoMercator projection. If an argument is provided, specifies a scale. The default is 960 / (π * 2), where 960 is the default width of the slippy map. If no scale is provided returns the map scale. The map scale represents the scale with no zoom applied (starting state), zoom is applied on top of this internally.

### slippy.setTileDepth(*depth*)

Sets the projection scale to an appropriate value given a specified tile depth.

### slippy.rotate(*rotate*)

Unlike a D3-geoprojection, this method does not take an array. It can be provided a single number representing the x rotation in degrees of the map. Like D3-geoprojection, rotation moves the world under you and thus is the negative of the value that would be used to center the map using `slippy.center()`.

### slippy.fit(*feature*)

Similar to `D3-geoprojection.fitSize()`, but as size is specified either by default or by using `slippy.size()`/`slippy.height()`/`slippy.width()`, the size is already known. Takes a geojson feature and modifies the projection so that it fits within the slippy map bounds. Can take an array of geojson features.

### slippy.fitMargin(*margin,feature*)

Similar to `slippy.fit()` but takes an extra parameter that specifies a margin and fits the geojson feature to the slippy map bounds given that margin.

### slippy.offset(*[offsetX,offsetY]*)

If an offset is provided, sets the offset between the projected point marking the north-west limit of the map and the top left extent of the SVG/Canvas (*This is not quite accurate - needs refinement*). These two are not always the same. If no offset is provided, returns the current offset.

Slippy projection translates are generally set to 0 to start, the zoom manages the translate. The offset refers to the distance from the upper left hand limit of the map (for a mercator this is `[-180,~85]`) in geographic coordinates (the north west most point) to the upper left hand limit of the SVG/Canvas. For most web mercator type maps this is zero - the upper left corner of the SVG/Canvas aligns with the north most and west most geographic point the map shows. For an polar projection, the north most/west most point the map can show is the north pole - in the center of the map. So the offset will be `[width/2, height/2]`.

The default is `[0,0]`.

### slippy.limit(*limit*)

If provided, sets the maximum latitude shown on the map. If not provided, returns the current limit. The maximum latitude that can be shown by the map - used for aligning tiles with projection. The default is `85.051133`. This is required for typical web tiles because the limit confines the projected geographic extent to a square - allowing for easy tiling.

## Zoom Methods

These methods are intended to interact with D3-zoom to implement dragging and zooming behavior. They do not modify the projection (except for translate values). These methods deal with translate and (zoom) scale, where zoom scale is multiplied against the projection scale.

### slippy.zoomScale(*scale*)

If an argument is provided, sets the zoom scale. A scale of 1 represents no alteration from the map scale, while a scale of 2 will increase map size four fold (twice as wide, twice as high). If no parameter is provided, returns the current zoom scale.

### slippy.zoomTranslate(*translate*)

If an argument is provided, sets the current zoom translate (*[x,y]*). If no argument is provided, returns the current zoom translate value.

### slippy.zoomTransform(*transform*)

Designed to implement both scale and translate at once using `d3.event.transform`:

     // Update on zoom:
     slippy.zoomTransform(d3.event.transform)
     
Allows updating of zoom transform easily during zoom events. Should be used over `slippy.zoomTranslate()` and `slippy.zoomScale()` in most use cases.

### slippy.zoomIdentity()

Returns the current zoom identity. Intended to be used when interfacing with `d3.zoom()`, such as when setting the zoom on a selection:

    svg
    .call(zoom)
    .call(zoom.transform, slippy.zoomIdentity());


### slippy.zoomScaleExtent(*[min,max]*)

Takes an array specifying a min and max zoom level for the map measured in **tile** units.
Tile scales start at 0 (entire world on one tile). For a given integer scale value (n) the number of tiles needed to map the world is  
4^n. This is method is in tile units as tile sets have minimum and maximum scale values in tile units.

If no array is given, returns the zoom scale extent in **zoom** units. This extent can be provided to d3.zoom().scaleExtent to set the bounds of zooming given a specified range of zoom levels specified in tiles.

*This method will be split into two*

### slippy.zoomTranslateExtent(*extent*)

If an argument is provided sets the intended translate extent of the map. Extent can be specified by an array: `[[x0,y0],[x1,y1]]` where `[x0,y0]` is the top right (north west) corner of the desired translate extent and `[x1,y1]` is the bottom right (south east) corner of the desired translate extent. Coordinate units are degrees longitude/latitude.

If no argument is provided returns the current extent. Without passing this value to `d3.zoom()` no panning extent is applied: 
*This is a courtesy method meant to interface with `d3.zoom().translateExtent()` by taking geographic extents and converting them into a translate extent in pixels given slippy scale values, rotation, center etc.*

The default value of the zoomTranslateExtent is an extent that is +/- ~85 degrees on the y axis and +/- 180 degrees from the rotational center of the slippy map (to better accomodate the anti-meridian).

### slippy.zoomTranslateConstrain()

Returns a zoom translate extent that limits panning to the current geographic extent of the slippy map. Again, meant to be interfaced with `d3.zoom()` like `slippy.zoomTranslateExtent()`.

## Tile Methods

### slippy.tiles()

Returns an array containing objects representing each tile on the map. Each item contains six properties:

```
x: the x value of the tile coordinate (tile units)
y: the y value of the tile coordinate (tile units)
z: the z value of the tile coordinate (tile units)
tx: the x value of the tile coordinate (pixel units)
ty: the y value of the tile coordinate (pixel units)
id: the id of the tile coordinate is equal to: "i" + x + "-" + y + "-" + z
```

### slippy.tile(*g*)

Enters, updates, and exits tiles from the given selection (idealy a selected `g`). Intended to be used on each zoom or map change event reducing boilerplate and tile code.

### slippy.canvas(*context*)

Draws tiles on a canvas given that canvas's context. Temporary home for this method.



























