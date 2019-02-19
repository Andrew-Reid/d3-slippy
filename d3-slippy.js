// Andrew Reid 2018
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.d3 = global.d3 || {}),global.d3));
}(this, function (exports) { 'use strict';
	
	
function geoTile() {
	// Basic Constants
	const tau = Math.PI * 2;
	var lim = 85.05113;
	var tileSize = 256;

	// Map Properties:
	var w = 960;
	var h = 500;
	
	// Projection Values:
	var pk = 960/tau; // projection scale k
	var pc = [0,0]  // projection geographic center
	var pr = 0      // central longitude for rotation.

	// Zoom Transform Values:
	var tk = 1;	// zoom transform scale k
	var tx = w/2; // zoom transform translate x
	var ty = h/2; // zoom transform translate y
	
	// Offsets for projections where the north west limit is no in the top left.
	var ox = function() { return 0 };
	var oy = function() { return 0 }; 	
		
	// The Projection:
	var p = d3.geoMercator()
	  .scale(pk)
      .center(pc);

	// Tile wrapping and zoom limits:
	var z0 = 4;
	var z1 = 13;
	var extent = function() { return {left:-179.99999,top:lim,right:179.9999,bottom:-lim}; };
	var wrap = true;
	
	// Tile ordering
	var xyz = true;
	
	// Tile source & attribution
	var source = function(d) {
		return "http://" + "abc"[d.y % 3] + ".tile.openstreetmap.org/" + d.z + "/" + d.x + "/" + d.y + ".png"; 
	}
	var a = "Tiles © OpenStreetMap contributors";
	// Tile ordering:
	geoTile.xyz = function(_) {
		return arguments.length ? (xyz = _, geoTile): xyz;
	}
		  
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
			(_ instanceof d3.selection) ? (w = _.attr("width"), h = _.attr("height"), tx = w/2, ty = h/2) : (w = _[0], h = _[1]);
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
		// Need to account for any rotation (divergence from d3.geoProjection typical behavior //
		var rotate = d3.geoRotation(p.rotate())
		if(arguments.length) {
			pc = rotate(_); p.center(pc); return geoTile;
		}
		else {
			return rotate.invert(pc); 
		}
		//return arguments.length ? (/*_[0] -= p.rotate()[0], _[1] -= p.rotate()[1], */ pc = _, p.center(pc), geoTile): pc;
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
	geoTile.fitMargin = function(m,f) {
		return arguments.length > 1 ? (p.fitExtent([[m,m],[w-m,h-m]],f), tx = p.translate()[0],ty = p.translate()[1],pk = p.scale(), geoTile) : "n/a";
	}
	geoTile.offset = function(_) {
		return arguments.length ? (ox = _[0], oy = _[1], geoTile): [ox,oy];
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
	
	// Get scale factor for tile depth:
	geoTile.tileDepth = function(z) {
		if(arguments.length) {
			return Math.pow(Math.E, ((z + 8) * Math.LN2)) / pk / tau;
		}	
		else {
			var size = pk * tk * tau;
			var z = Math.max(Math.log(size) / Math.LN2 - 8, 0);
			return Math.round(z);
		}
	}
	
	// Set tile depth:
	geoTile.setTileDepth = function(_) {
		pk *= geoTile.tileDepth(_); p.scale(pk); return geoTile;
	}
	
	// Set/get tile size:
	geoTile.tileSize = function(_) {
		return arguments.length ? (tileSize = _, geoTile) : tileSize;
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
		var e = extent();
		if (arguments.length) {
			e.left = _[0][0];
			e.top = _[0][1];
			e.right = _[1][0];
			e.bottom = _[1][1];			
			return geoTile;
		}
		else {
			var x0 = p([e.left-pr,e.top])[0] - tx;
			var y0 = p([e.left-pr,e.top])[1] - ty;
			var x1 = p([e.right-pr,e.bottom])[0] - tx;
			var y1 = p([e.right-pr,e.bottom])[1] - ty;
			return [[x0,y0],[x1,y1]];
		}
	}
	geoTile.zoomTranslateConstrain = function() {
		var e = extent();
		e.left = p.invert([0,0])[0];
		e.top = p.invert([0,0])[1];
		e.right = p.invert([w,h])[0];
		e.bottom = p.invert([w,h])[1];
		
		var x0 = p([e.left-pr,e.top])[0] - tx;
		var y0 = p([e.left-pr,e.top])[1] - ty;
		var x1 = p([e.right-pr,e.bottom])[0] - tx;
		var y1 = p([e.right-pr,e.bottom])[1] - ty;
		return [[x0,y0],[x1,y1]];				
	}

	// Tile Methods:	
	// Calculate Tiles:
	geoTile.tiles = function() {
		var size = pk * tk * tau / 1.000254;
		var z = Math.max(Math.log(size) / Math.LN2 - Math.log(tileSize)/Math.log(2), 0); // tile depth 
		var s = Math.pow(2, z - Math.round(z) + 8);

		var y0 = p([-180,lim])[1] - oy.call(this,w,h) * tk * pk/w*tau;
		var x0 = p([-180,lim])[0] - ox.call(this,w,h) * tk * pk/w*tau;
		
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
		
		if(!xyz) {
			set.forEach(function(d) {
				d.y = (Math.pow(2, d.z) - d.y - 1)
			})
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
			.attr("x", function(d) { return d.tx * tileSize; })
			.attr("y", function(d) { return d.ty * tileSize; })
			.attr("width", tileSize)
			.attr("height", tileSize);	
	}
	
	// Draw on a canvas:
	geoTile.canvas = function(context) {
		var set = geoTile.tiles();
		var k = set.scale / tileSize, r = set.scale % 1 ? Number : Math.round;
		var ox = r(set.translate[0] * set.scale);
		var oy = r(set.translate[1] * set.scale);
		set.forEach(function(d) {
			var tile = new Image();
			tile.src = source(d); // can also be a remote URL e.g. http://
			tile.onload = function() {
				context.drawImage(tile,d.tx*tileSize*k+ox,d.ty*tileSize*k+oy,tileSize*k,tileSize*k);
			};
		})
	}		
	
	// Helper stringify	
	function stringify(scale, translate) {
		var k = scale / tileSize, r = scale % 1 ? Number : Math.round;
		return "translate(" + r(translate[0] * scale) + "," + r(translate[1] * scale) + ") scale(" + k + ")";
	}
	
	geoTile.tileSet = function(_) {
		if(arguments.length) {
			a = _.attribution ? _.attribution : "Unknown";
			p = _.projection ? _.projection.scale(960/tau).translate([0,0]) : d3.geoMercator().scale(960/tau).translate([0,0]);
			source = _.source ? _.source : (console.log("no source provided, using osm"), a = "Tiles © OpenStreetMap contributors", function(d) { return "http://" + "abc"[d.y % 3] + ".tile.openstreetmap.org/" + d.z + "/" + d.x + "/" + d.y + ".png";  })
			lim = _.limit ? _.limit : 85.05113;
			tileSize = _.tileSize ? _.tileSize : 256;
			ox = _.offsetX ? _.offsetX : function() { return 0 };
			oy = _.offsetY ? _.offsetY : function() { return  0 };
			z0 = _.minDepth ? _.minDepth : 1;
			z1 = _.maxDepth ? _.maxDepth : 13;
			wrap = _.wrap ? _.wrap : false;
			xyz = _.xyz ? _.xyz : true; // tile ordering
		}
		return geoTile;		
	}
  return geoTile;

}


		
var tileSets = {
  CartoDB_Positron : {
    type:"tileset",
    attribution: "© OpenStreetMap © CartoDB",
    source: function(d) { return "https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/"+d.z+"/"+d.x+"/"+d.y+".png"; }
  },
  CartoDB_PositronNoLabels : {
    type:"tileset",
    attribution: "© OpenStreetMap © CartoDB",
    source: function(d) { return "https://cartodb-basemaps-b.global.ssl.fastly.net/light_nolabels/"+d.z+"/"+d.x+"/"+d.y+".png"; }
  },
  CartoDB_PositronOnlyLabels : {
    type: "tileset",
    attribution: "© OpenStreetMap © CartoDB",
    source: function(d) { return "https://cartodb-basemaps-b.global.ssl.fastly.net/light_only_labels/"+d.z+"/"+d.x+"/"+d.y+".png"; }
  },
  CartoDB_DarkMatter : {
    type: "tileset",
    attribution: "© OpenStreetMap © CartoDB",
    source: function(d) { return "https://cartodb-basemaps-b.global.ssl.fastly.net/dark_all/"+d.z+"/"+d.x+"/"+d.y+".png"; }
  },
  CartoDB_DarkMatterNoLabels : {
    type: "tileset", 
    attribution: "© OpenStreetMap © CartoDB",
    source: function(d) {return "https://cartodb-basemaps-b.global.ssl.fastly.net/dark_nolabels/"+d.z+"/"+d.x+"/"+d.y+".png"; }
  },
  CartoDB_DarkMatterOnlyLabels : {
    type: "tileset",
	attribution: "© OpenStreetMap © CartoDB",
	source: function(d) { return "https://cartodb-basemaps-b.global.ssl.fastly.net/dark_only_labels/"+d.z+"/"+d.x+"/"+d.y+".png"; }
  },
  CartoDB_Voyager : {
    type: "tileset",
    attribution: "© OpenStreetMap © CartoDB",
    source: function(d) { return "https://cartodb-basemaps-b.global.ssl.fastly.net/rastertiles/voyager/"+d.z+"/"+d.x+"/"+d.y+".png";}
  },
  ESRI_WorldTerrain : {
    type: "tilset",
    attribution: "Tiles © Esri - Source: USGS, Esri, TANA, DeLorme, and NPS",
    source: function(d) { return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/"+d.z+"/"+d.y+"/"+d.x+".png";}
  },
  ESRI_WorldShadedRelief : {
    type: "tileset",
    attribution: "Tiles © Esri - Source: Esri",
    source: function(d) {return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/"+d.z+"/"+d.y+"/"+d.x+".png"; }			
  },
  ESRI_WorldPhysical : {
    type:"tileset",
	attribution: "Tiles © Esri - Source: US National Park Service",
	source: function(d) { return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/"+d.z+"/"+d.y+"/"+d.x+".png"; }			
  },
  ESRI_WorldStreetMap : {
    type:"tileset",
	attribution:"Tiles © Esri - Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom",
	source: function(d) { return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/"+d.z+"/"+d.y+"/"+d.x+".png"; }	
  },
  ESRI_WorldTopoMap : {
	type: "tileset",
    attribution: "Tiles © Esri - Source: Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community",
    source: function(d) { return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/"+d.z+"/"+d.y+"/"+d.x+".png"; }			
  },
  ESRI_WorldImagery : {
    type:"tileset",
    attribution: "Tiles © Esri - Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    source : function(d) {	return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/"+d.z+"/"+d.y+"/"+d.x+".png";	}		
  },
  ESRI_OceanBasemap : {
    type: "tileset",
	attribution:"Tiles © Esri - Source: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri",
	source: function(d) { return "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/"+d.z+"/"+d.y+"/"+d.x+".png"; }		
  },
  ESRI_NGWorld : {
    type: "tileset",
    attribution: "Tiles © Esri - Source:  National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC",
    source : function(d) { return "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/"+d.z+"/"+d.y+"/"+d.x+".png"; }		
  },
  ESRI_Gray : {
    type: "tileset",
	attribution: "Tiles © Esri - Source:  Esri, DeLorme, NAVTEQ",
    source : function(d) { return "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/"+d.z+"/"+d.y+"/"+d.x+".png"; }			
  },
  OSM_Topo : {
    type: "tileset",
    attribution: "Tiles © OpenStreetMap contributors",
    source: function(d) { return "https://tile.opentopomap.org/"+d.z+"/"+d.x+"/"+d.y+".png"; }
  },
  OSM: {
    type:"tileset",
    attribution: "Tiles © OpenStreetMap contributors",
    source: function(d) { return "https://" + "abc"[d.y % 3] + ".tile.openstreetmap.org/" + d.z + "/" + d.x + "/" + d.y + ".png"; }		
  },
  Stamen_Toner : {
    type: "tileset",
    attribution: "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL.",
    source: function(d) { return "https://stamen-tiles.a.ssl.fastly.net/toner/" + d.z + "/" + d.x + "/" + d.y + ".png"; }			
  },
  Stamen_TonerBackground : {
    type:"tileset",
    attribution: "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL.",
    source: function(d) { return "https://stamen-tiles.a.ssl.fastly.net/toner-background/" + d.z + "/" + d.x + "/" + d.y + ".png"; }			
  },
  Stamen_TonerLines : {
    type:"tileset",
    attribution:"Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL.",
    source: function(d) { return "https://stamen-tiles.a.ssl.fastly.net/toner-lines/" + d.z + "/" + d.x + "/" + d.y + ".png"; }			
  },
  Stamen_TonerLite : {
    type:"tileset",
    attribution: "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL.",
    source: function(d) { return "https://stamen-tiles.a.ssl.fastly.net/toner-lite/" + d.z + "/" + d.x + "/" + d.y + ".png"; }			
  },
  Stamen_Terrain : {
    type:"tileset",
    attribution: "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL.",
    source: function(d) { return "https://stamen-tiles.a.ssl.fastly.net/terrain/" + d.z + "/" + d.x + "/" + d.y + ".png"; }			
  },
  Stamen_TerrainBackground : {
    type:"tileset",
    attribution: "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL.",
    source: function(d) {	return "https://stamen-tiles.a.ssl.fastly.net/terrain-background/" + d.z + "/" + d.x + "/" + d.y + ".png"; }			
  },
  Stamen_TerrainLines : {
    type:"tileset",
	attribution: "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL.",
	source: function(d) { return "https://stamen-tiles.a.ssl.fastly.net/terrain-lines/" + d.z + "/" + d.x + "/" + d.y + ".png"; }			
  },
  Stamen_Watercolor: {
    type:"tileset",
    attribution:"Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA.",
    source: function(d) {return "https://stamen-tiles.a.ssl.fastly.net/watercolor/" + d.z + "/" + d.x + "/" + d.y + ".png"; }			
  }
}


  // Tilesets:
  exports.tileSet = tileSets;
  exports.geoSlippy = geoTile;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
