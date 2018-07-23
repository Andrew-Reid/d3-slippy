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
	  
	function geoTile(_) {
		return p(_);
	}

	// Projection methods:
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
	
	// Size:
	geoTile.width = function(_) {
		return arguments.length ? (w = _, geoTile) : w;
	}
	geoTile.height = function(_) {
		return arguments.length ? (h = _, geoTile) : h;
	}

	// Tile source:
	var source = function(d) {
		return "http://" + "abc"[d.y % 3] + ".tile.openstreetmap.org/" + d.z + "/" + d.x + "/" + d.y + ".png"; 
	}	
	
	// Zoom functions:
	geoTile.zoomScale = function(_) {
		return arguments.length ? (tk = _, p.scale(pk*tk), geoTile) : tk;
	}
	geoTile.zoomTranslate = function(_) {	
		return arguments.length ? (tx = _[0], ty = _[1], p.translate([tx, ty])): geoTile; 
	}
	geoTile.zoomIdentity = function() {
		return d3.zoomIdentity.translate(px,py).scale(tk).translate(0,0);
	}

	
	geoTile.projection = function(_) {
		return p;
	}	
	
	geoTile.tiles = function() {
		var size = pk * tk * tau;
		var z = Math.max(Math.log(size) / Math.LN2 - 8, 0); // z, assuming image size of 256.  // what do in case of rounding?
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
	
	// To break out properly in the future:
	geoTile.tileSet = function(_) {
		if(_ == "ESRI_WorldTerrain") {
			source = function(d) {
				return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/"+d.z+"/"+d.y+"/"+d.x+".png";
			}
		}
		else if (_ == "ESRI_WorldShadedRelief") {
			source = function(d) {
				return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/"+d.z+"/"+d.y+"/"+d.x+".png";
			}			
		}
		else if (_ == "ESRI_WorldPhysical") {
			source = function(d) {
				return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/"+d.z+"/"+d.y+"/"+d.x+".png";
			}			
		}
		else if (_ == "ESRI_WorldStreetMap") {
			source = function(d) {
				return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/"+d.z+"/"+d.y+"/"+d.x+".png";
			}			
		}
		else {
			// Default:
			source = function(d) {
				return "http://" + "abc"[d.y % 3] + ".tile.openstreetmap.org/" + d.z + "/" + d.x + "/" + d.y + ".png"; 
			}
		}
		
		return geoTile;
	}

	return geoTile;

}
		

  exports.geoTile = geoTile;

  Object.defineProperty(exports, '__esModule', { value: true });

}));