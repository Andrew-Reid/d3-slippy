//
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-array')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-array'], factory) :
  (factory((global.d3 = global.d3 || {}),global.d3));
}(this, function (exports,d3Array) { 'use strict';
	
	
function geoTile() {
	
	// Basic Constants
	const tau = Math.PI * 2;
	const lim = 85.05113;

	// Map Properties:
	var w = 960;
	var h = 500;
	
	// Projection Values:
	var pk = w/tau; // projection scale k
	var px = w/2;   // projection translate x
	var py = h/2;   // projection translate y
	var pc = [0,0]  // projection geographic center
	
	// Zoom Transform Values:
	var tk = 1;	// zoom transform scale k
	var tx = 0; // zoom transform translate x
	var ty = 0; // zoom transform translate y
	
	// The Projection:
	var p = d3.geoMercator()
	  .scale(pk)
	  .translate([px,py])
      .center(pc);
	  
	// Tile source:
	var source = function(d) {
		return "http://" + "abc"[d.y % 3] + ".tile.openstreetmap.org/" + d.z + "/" + d.x + "/" + d.y + ".png"; 
	}
	var a = "Tiles © OpenStreetMap contributors";
	  
	function geoTile(_) {
	
		return p(_);
	}
	
	// General Methods
	geoTile.width = function(_) {
		return arguments.length ? (w = _, geoTile) : w;
	}
	geoTile.height = function(_) {
		return arguments.length ? (h = _, geoTile) : h;
	}
	geoTile.size = function(_) {
		return arguments.length > 1 ? (h = _[0], h = _[1], geoTile) : [w,h];
	}
	geoTile.source = function(_) {
		return arguments.length ? (source = _, geoTile) : source;
	}
	geoTile.projection = function() {
		return p;
	}		
	
	// Projection methods:
	geoTile.invert = function(_) {
		return p.invert(_);
	}
	geoTile.center = function(_) {
		return arguments.length ? (pc = _, p.center(pc), geoTile): pc;
	}	
	geoTile.scale = function(_) {
		return arguments.length ? (pk = _, p.scale(pk), geoTile) : pk;
	}	
	geoTile.translate = function(_) {
		return arguments.length ? (px = _[0], py = _[1], p.translate([px,py])) : [px,py]
	}
	geoTile.fit = function(_) {
		return arguments.length ? (p.fitSize([w,h],_),px = p.translate()[0],py = p.translate()[1],pk = p.scale(), geoTile) : "n/a";
	}
	geoTile.fitExtent = function(e,f) {
		return arguments.length > 1 ? (p.fitExtent(e,f),px = p.translate()[0],py = p.translate()[1],pk = p.scale(), geoTile) : "n/a";
	}
		
	// Zoom Methods:
	geoTile.zoomScale = function(_) {
		return arguments.length ? (tk = _, p.scale(pk*tk), geoTile) : tk;
	}
	geoTile.zoomTranslate = function(_) {	
		return arguments.length ? (tx = _[0], ty = _[1], p.translate([tx, ty])): geoTile; 
	}
	geoTile.zoomIdentity = function() {
		return d3.zoomIdentity.translate(px,py).scale(tk).translate(0,0);
	}

	// Tile Methods:	
	geoTile.tiles = function() {
		var size = pk * tk * tau;
		var z = Math.max(Math.log(size) / Math.LN2 - 8, 0); // z, assuming image size of 256.  
		var s = Math.pow(2, z - Math.round(z) + 8);
		
		var y0 = p([-180,lim])[1];
		var x0 = p([-180,lim])[0];

		var set = [];
		var cStart = Math.max(0,Math.floor((0 - x0) / s));
		var cEnd = Math.max(0, Math.ceil((w - x0) / s));
		var rStart = Math.max(0,Math.floor((0 - y0) / s));
		var rEnd = Math.max(0, Math.ceil((h - y0) / s));
	
		for(var i = cStart; i < cEnd; i++) {
			for(var j = rStart; j < rEnd; j++) {
				set.push({x:i,y:j,z:Math.round(z),id:i+"-"+j+"-"+z}) 
			}
		}
		
		set.translate = [x0 / s, y0 / s];
        set.scale = s;

		return set;
	
	}
	
	geoTile.tile = function(g) {
		
		var set = geoTile.tiles();
		var images = g.attr("transform", stringify(set.scale, set.translate))
			.selectAll("image")
			.data(set, function(d) { return d.id; })
			
		images.exit().remove();
		images.enter().append("image").merge(images)
			.attr("xlink:href", source )
			.attr("x", function(d) { return d.x * 256; })
			.attr("y", function(d) { return d.y * 256; })
			.attr("width", 256)
			.attr("height", 256);	
	}
	
	
	
	function stringify(scale, translate) {
		var k = scale / 256, r = scale % 1 ? Number : Math.round;
		return "translate(" + r(translate[0] * scale) + "," + r(translate[1] * scale) + ") scale(" + k + ")";
	}
	
	// To break out in the future, at least use switch ?:
	geoTile.tileSet = function(_) {
		// CartoDB:
		if(_ == "CartoDB_Positron") {
			a = "© OpenStreetMap © CartoDB";
			source = function(d) {
				return "https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/"+d.z+"/"+d.x+"/"+d.y+".png";
			}
		}		
		else if(_ == "CartoDB_PositronNoLabels") {
			a = "© OpenStreetMap © CartoDB";
			source = function(d) {
				return "https://cartodb-basemaps-b.global.ssl.fastly.net/light_nolabels/"+d.z+"/"+d.x+"/"+d.y+".png";
			}
		}			
		else if(_ == "CartoDB_PositronOnlyLaebls") {
			a = "© OpenStreetMap © CartoDB";
			source = function(d) {
				return "https://cartodb-basemaps-b.global.ssl.fastly.net/light_only_labels/"+d.z+"/"+d.x+"/"+d.y+".png";
			}
		}	
		else if(_ == "CartoDB_DarkMatter") {
			a = "© OpenStreetMap © CartoDB";
			source = function(d) {
				return "https://cartodb-basemaps-b.global.ssl.fastly.net/dark_all/"+d.z+"/"+d.x+"/"+d.y+".png";
			}
		}
		else if(_ == "CartoDB_DarkMatterOnlyLaebls") {
			a = "© OpenStreetMap © CartoDB";
			source = function(d) {
				return "https://cartodb-basemaps-b.global.ssl.fastly.net/dark_only_labels/"+d.z+"/"+d.x+"/"+d.y+".png";
			}
		}
		else if(_ == "CartoDB_DarkMatterOnlyLaebls") {
			a = "© OpenStreetMap © CartoDB";
			source = function(d) {
				return "https://cartodb-basemaps-b.global.ssl.fastly.net/dark_only_labels/"+d.z+"/"+d.x+"/"+d.y+".png";
			}
		}
		
		// ESRI
		else if(_ == "ESRI_WorldTerrain") {
			a = "Tiles © Esri - Source: USGS, Esri, TANA, DeLorme, and NPS"
			source = function(d) {
				return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/"+d.z+"/"+d.y+"/"+d.x+".png";
			}
		}
		else if (_ == "ESRI_WorldShadedRelief") {
			a = "Tiles © Esri - Source: Esri";
			source = function(d) {
				return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/"+d.z+"/"+d.y+"/"+d.x+".png";
			}			
		}
		else if (_ == "ESRI_WorldPhysical") {
			a = "Tiles © Esri - Source: US National Park Service";
			source = function(d) {
				return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/"+d.z+"/"+d.y+"/"+d.x+".png";
			}			
		}
		else if (_ == "ESRI_WorldStreetMap") {
			a = "Tiles © Esri - Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom";
			source = function(d) {
				return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/"+d.z+"/"+d.y+"/"+d.x+".png";
			}			
		}		
		else if (_ == "ESRI_WorldTopoMap") {
			a = "Tiles © Esri - Source: Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community";
			source = function(d) {
				return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/"+d.z+"/"+d.y+"/"+d.x+".png";
			}			
		}		
		else if (_ == "ESRI_WorldImagery") {
			a = "Tiles © Esri - Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community";
			source = function(d) {
				return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/"+d.z+"/"+d.y+"/"+d.x+".png";
			}		
		}
		else if (_ == "ESRI_OceanBasemap") {
			a = "Tiles © Esri - Source: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri";
			source = function(d) {
				return "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/"+d.z+"/"+d.y+"/"+d.x+".png";
			}		
		}		
		else if (_ == "ESRI_NGWorld") {
			a = "Tiles © Esri - Source:  National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC";
			source = function(d) {
				return "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/"+d.z+"/"+d.y+"/"+d.x+".png";
			}		
		}
		else if (_ == "ESRI_Gray") {
			a = "Tiles © Esri - Source:  National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC";
			source = function(d) {
				return "'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/"+d.z+"/"+d.y+"/"+d.x+".png";
			}			
		}
				
		// OSM
		else if (_ == "OSM_Topo") {
			a = "Tiles © OpenStreetMap contributors";
			source = function(d) {
				return "https://tile.opentopomap.org/"+d.z+"/"+d.x+"/"+d.y+".png"; 
			}
		}
		else if (_ == "OSM") {
			a = "Tiles © OpenStreetMap contributors";
			source = function(d) {
				return "https://" + "abc"[d.y % 3] + ".tile.openstreetmap.org/" + d.z + "/" + d.x + "/" + d.y + ".png"; 
			}		
		}
		
		
		// STAMEN
		else if (_ == "Stamen_Toner") {
			a = "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL."			
			source = function(d) {
				return "https://stamen-tiles.a.ssl.fastly.net/toner/" + d.z + "/" + d.x + "/" + d.y + ".png"; 
			}			
		}
		else if (_ == "Stamen_TonerBackground") {
			a = "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL."			
			source = function(d) {
				return "https://stamen-tiles.a.ssl.fastly.net/toner-background/" + d.z + "/" + d.x + "/" + d.y + ".png"; 
			}			
		}
		else if (_ == "Stamen_TonerLines") {
			a = "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL."			
			source = function(d) {
				return "https://stamen-tiles.a.ssl.fastly.net/toner-lines/" + d.z + "/" + d.x + "/" + d.y + ".png"; 
			}			
		}
		else if (_ == "Stamen_TonerLite") {
			a = "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL."			
			source = function(d) {
				return "https://stamen-tiles.a.ssl.fastly.net/toner-lite/" + d.z + "/" + d.x + "/" + d.y + ".png"; 
			}			
		}
		else if (_ == "Stamen_TonerLite") {
			a = "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL."			
			source = function(d) {
				return "https://stamen-tiles.a.ssl.fastly.net/toner-lite/" + d.z + "/" + d.x + "/" + d.y + ".png"; 
			}			
		}		
		else if (_ == "Stamen_Terrain") {
			a = "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL."			
			source = function(d) {
				return "https://stamen-tiles.a.ssl.fastly.net/terrain/" + d.z + "/" + d.x + "/" + d.y + ".png"; 
			}			
		}		
		else if (_ == "Stamen_TerrainBackground") {
			a = "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL."			
			source = function(d) {
				return "https://stamen-tiles.a.ssl.fastly.net/terrain-background/" + d.z + "/" + d.x + "/" + d.y + ".png"; 
			}			
		}	
		else if (_ == "Stamen_TerrainLines") {
			a = "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL."			
			source = function(d) {
				return "https://stamen-tiles.a.ssl.fastly.net/terrain-lines/" + d.z + "/" + d.x + "/" + d.y + ".png"; 
			}			
		}		
		else if (_ == "Stamen_Watercolor") {
			a = "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA."			
			source = function(d) {
				return "https://stamen-tiles.a.ssl.fastly.net/watercolor/" + d.z + "/" + d.x + "/" + d.y + ".png"; 
			}			
		}			
		
		
		
		
		else {
			// Default:
			console.log("Unknown Tileset, using OSM");
			a = "Tiles © OpenStreetMap contributors";
			source = function(d) {
				return "http://" + "abc"[d.y % 3] + ".tile.openstreetmap.org/" + d.z + "/" + d.x + "/" + d.y + ".png"; 
			}
		}
		
		return geoTile;
	}

	return geoTile;

}


  exports.geoTile = geoTile;
 // exports.geoTileSource = geoTileSource;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
