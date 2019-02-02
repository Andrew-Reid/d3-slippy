// Andrew Reid 2018
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.d3 = global.d3 || {}),global.d3));
}(this, function (exports) { 'use strict';
	
	
function geoTile() {
	// Basic Constants
	const tau = Math.PI * 2;
	const lim = 85.05113;

	// Map Properties:
	var w = 960;
	var h = 500;
	
	// Projection Values:
	var pk = w/tau; // projection scale k
	var pc = [0,0]  // projection geographic center
	var pr = 0      // central longitude for rotation.

	// Zoom Transform Values:
	var tk = 1;	// zoom transform scale k
	var tx = w/2; // zoom transform translate x
	var ty = h/2; // zoom transform translate y
		
	// The Projection:
	var p = d3.geoMercator()
	  .scale(pk)
      .center(pc);

	// Tile wrapping and zoom limits:
	var z0 = 4;
	var z1 = 13;
	var extent = {left:-179.99999,top:lim,right:179.9999,bottom:-lim};
	var wrap = false;
	
	// Tile source & attribution
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
		if(arguments.length) {
			(_ instanceof d3.selection) ? (w = _.attr("width"), h = _.attr("height")) : (w = _[0], h = _[1]);
			return geoTile;
		}
		else return [w,h]
	}
	geoTile.source = function(_) {
		return arguments.length ? (source = _, geoTile) : source;
	}
	geoTile.projection = function() {
		return p;
	}
	geoTile.attribution = function(_) {
		return arguments.length ? (a = _, geoTile) : a;
	}
	geoTile.wrap = function(_) {
		return arguments.length ? (wrap = _, geoTile) : wrap;
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
	geoTile.rotate = function(_) {
		return arguments.length ? (pr = _, p.rotate([pr,0]), geoTile) : pr;
	}
	geoTile.fit = function(_) {
		return arguments.length ? (p.fitSize([w,h],_),tx = p.translate()[0],ty = p.translate()[1],pk = p.scale(), geoTile) : "n/a";
	}
	geoTile.fitExtent = function(e,f) {
		return arguments.length > 1 ? (p.fitExtent(e,f),pk = p.scale(),tx = p.translate()[0],ty = p.translate()[1], geoTile) : "n/a";
	}
	geoTile.fitMargin = function(m,f) {
		return arguments.length > 1 ? (p.fitExtent([[m,m],[w-m,h-m]],f), tx = p.translate()[0],ty = p.translate()[1],pk = p.scale(), geoTile) : "n/a";
	}
		
		
	// Zoom Methods:
	geoTile.zoomScale = function(_) {
		return arguments.length ? (tk = _, p.scale(pk*tk), geoTile) : tk;
	}
	geoTile.zoomTranslate = function(_) {	
		return arguments.length ? (tx = _[0], ty = _[1], p.translate([tx, ty]), geoTile): [tx,ty] 
	}
	geoTile.zoomIdentity = function() {
		return d3.zoomIdentity.translate(tx,ty).scale(tk).translate(0,0);
	}
	geoTile.zoomTransform = function(t) {
		tx = t.x, ty = t.y, tk = t.k; p.translate([tx,ty]); p.scale(pk*tk); return geoTile;
	}
	
	
	// Convert between zoom k and tile depth.
	geoTile.tileDepth = function(z) {
		if(arguments.length) {
			tk = Math.pow(Math.E, ((z + 8) * Math.LN2)) / pk / tau;
		}
		else {
			
			var size = pk * tk * tau;
			var z = Math.max(Math.log(size) / Math.LN2 - 8, 0);
			return Math.round(z);
		}
	}	

	// Zoom extent methods:
	geoTile.zoomScaleExtent = function(_) {
		if (arguments.length) {
			z0 = _[0];
			z1 = _[1];		
			return geoTile;
		}
		else {
			var size = pk * tk * tau;
			var z = Math.max(Math.log(size) / Math.LN2 - 8, 0);
			var max = Math.pow(2,z1)/Math.pow(2,z);
			var min = Math.pow(2,z0)/Math.pow(2,z);
			return [min,max];
		}
	}
	geoTile.zoomTranslateExtent = function(_) {
		if (arguments.length) {
			extent.left = _[0][0];
			extent.top = _[0][1];
			extent.right = _[1][0];
			extent.bottom = _[1][1];			
			return geoTile;
		}
		else {
			var x0 = p([extent.left-pr,extent.top])[0] - tx;
			var y0 = p([extent.left-pr,extent.top])[1] - ty;
			var x1 = p([extent.right-pr,extent.bottom])[0] - tx;
			var y1 = p([extent.right-pr,extent.bottom])[1] - ty;
			return [[x0,y0],[x1,y1]];
		}
	}
	geoTile.zoomTranslateConstrain = function() {
		extent.left = p.invert([0,0])[0];
		extent.top = p.invert([0,0])[1];
		extent.right = p.invert([w,h])[0];
		extent.bottom = p.invert([w,h])[1];
		
		var x0 = p([extent.left-pr,extent.top])[0] - tx;
		var y0 = p([extent.left-pr,extent.top])[1] - ty;
		var x1 = p([extent.right-pr,extent.bottom])[0] - tx;
		var y1 = p([extent.right-pr,extent.bottom])[1] - ty;
		return [[x0,y0],[x1,y1]];				
	}

	// Tile Methods:	
	// Calculate Tiles:
	geoTile.tiles = function() {
		var size = pk * tk * tau;
		var z = Math.max(Math.log(size) / Math.LN2 - 8, 0); // z, assuming image size of 256 (2^8).  
		var s = Math.pow(2, z - Math.round(z) + 8);
				
		var y0 = p([-180,lim])[1];
		var x0 = p([-180,lim])[0];

		var set = [];
		var cStart = wrap ? Math.floor((0 - x0) / s) : Math.max(0, Math.floor((0 - x0) / s));
		var cEnd = Math.max(0, Math.ceil((w - x0) / s));
		var rStart = Math.max(0,Math.floor((0 - y0) / s));
		var rEnd = Math.max(0, Math.ceil((h - y0) / s));
		
		for(var i = cStart; i < cEnd; i++) {
			for(var j = rStart; j < rEnd; j++) {
				var x = i;
				if (wrap) {
					var k = Math.pow(2,Math.round(z));
					x = (i+k)%k;
				}
				set.push({x:x,y:j,z:Math.round(z),tx:i,ty:j, id:i+"-"+j+"-"+z}) 
			}
		}

		set.translate = [x0 / s, y0 / s];
		set.scale = s;

		return set;
	}
	// Assign Tiles to a Selection:
	geoTile.tile = function(g) {
		var set = geoTile.tiles();
		var images = g.attr("transform", stringify(set.scale, set.translate))
			.selectAll("image")
			.data(set, function(d) { return d.id; })
			
		images.exit().remove();
		images.enter().append("image").merge(images)
			.attr("xlink:href", source )
			.attr("x", function(d) { return d.tx * 256; })
			.attr("y", function(d) { return d.ty * 256; })
			.attr("width", 256)
			.attr("height", 256);	
	}
	
	// Draw on a canvas:
	geoTile.canvas = function(context) {
		var set = geoTile.tiles();
		var k = set.scale / 256, r = set.scale % 1 ? Number : Math.round;
		var ox = r(set.translate[0] * set.scale);
		var oy = r(set.translate[1] * set.scale);
		set.forEach(function(d) {
			var tile = new Image();
			tile.src = source(d); // can also be a remote URL e.g. http://
			tile.onload = function() {
				context.drawImage(tile,d.tx*256*k+ox,d.ty*256*k+oy,256*k,256*k);
			};
		})
	}	
	
	// Helper stringify	
	function stringify(scale, translate) {
		var k = scale / 256, r = scale % 1 ? Number : Math.round;
		return "translate(" + r(translate[0] * scale) + "," + r(translate[1] * scale) + ") scale(" + k + ")";
	}
	
	// To break out in the future, at least use switch ?:
	geoTile.tileSet = function(_) {
		if(typeof _ == "function") {
			source = _;
		}
		
		// CartoDB:
		else if(_ == "CartoDB_Positron") {
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
		else if(_ == "CartoDB_PositronOnlyLabels") {
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
		else if(_ == "CartoDB_DarkMatterNoLabels") {
			a = "© OpenStreetMap © CartoDB";
			source = function(d) {
				return "https://cartodb-basemaps-b.global.ssl.fastly.net/dark_nolabels/"+d.z+"/"+d.x+"/"+d.y+".png";
			}
		}
		else if(_ == "CartoDB_DarkMatterOnlyLabels") {
			a = "© OpenStreetMap © CartoDB";
			source = function(d) {
				return "https://cartodb-basemaps-b.global.ssl.fastly.net/dark_only_labels/"+d.z+"/"+d.x+"/"+d.y+".png";
			}
		}
		else if(_ == "CartoDB_Voyager") {
			a = "© OpenStreetMap © CartoDB";
			source = function(d) {
				return "https://cartodb-basemaps-b.global.ssl.fastly.net/rastertiles/voyager/"+d.z+"/"+d.x+"/"+d.y+".png";
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
			a = "Tiles © Esri - Source:  Esri, DeLorme, NAVTEQ";
			source = function(d) {
				return "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/"+d.z+"/"+d.y+"/"+d.x+".png";
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
  exports.geoSlippy = geoTile;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
