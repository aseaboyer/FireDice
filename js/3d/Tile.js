function Tile( obj, hasHouse, truckStart, hasRoad, roadData, pos ) {
	this.object = obj;
	this.hasHouse = hasHouse;
	this.truckStart = truckStart;
	this.hasRoad = hasRoad;
	this.roadData = roadData;
	this.fireRating = 0;
	this.position = pos;
}

Tile.prototype = {
	update: function(s) {
		
	},
	init: function(s) {
		if(this.hasHouse) {
			this.createHouse(s);
		}
		if(this.hasRoad) {
			this.createRoad(s);
		}
	},
	clicked: function(bool) {
		var useMat;
		if(bool == true) {
			useMat = game.mats.tileMats.active;
		} else {
			useMat = game.mats.tileMats.inactive;
		}
		this.object.material = useMat;
	},
	createHouse: function(s) {
		
		var houseMat = new THREE.MeshLambertMaterial( { 
			color: ( Math.random() * 0xffffff ), 
			shading: THREE.FlatShading, 
			overdraw: 0.5
		});
		var houseGeometry = new THREE.BoxGeometry( game.house.dims.x, game.house.dims.y, game.house.dims.z );
		var house = new THREE.Mesh( houseGeometry, houseMat ); // the house should be a random color
		
		house.position.x = this.object.position.x + game.house.offset.x;
		house.position.z = this.object.position.z + game.house.offset.z;
		house.position.y = this.object.position.y + game.tileSize.y + game.house.offset.y;
		
		s.add( house );
	},
	createRoad: function(s) { // @aseaboyer - maybe the roads should be material overlays....
		var newTilegeometry = new THREE.BoxGeometry( 
			(game.tileSize.x/3), 
			(game.tileSize.y/3), 
			(game.tileSize.z/3)
		);
		var tilePosY = this.object.position.y + (game.roadHeight) + 20;
		var centerTile = new THREE.Mesh( newTilegeometry, game.mats.road );
		centerTile.position.x = this.object.position.x;
		centerTile.position.y = tilePosY;
		centerTile.position.z = this.object.position.z;
		
		s.add( centerTile );
		
		if(this.roadData.n == true) {
			var nTile = new THREE.Mesh( newTilegeometry, game.mats.road );
			nTile.position.x = this.object.position.x;
			nTile.position.y = tilePosY;
			nTile.position.z = this.object.position.z - (game.tileSize.z * 0.3);
			
			s.add( nTile );
		}
		
		if(this.roadData.s == true) {
			var sTile = new THREE.Mesh( newTilegeometry, game.mats.road );
			sTile.position.x = this.object.position.x;
			sTile.position.y = tilePosY;
			sTile.position.z = this.object.position.z + (game.tileSize.z * 0.3);
			
			s.add( sTile );
		}
		
		if(this.roadData.e == true) {
			var eTile = new THREE.Mesh( newTilegeometry, game.mats.road );
			eTile.position.x = this.object.position.x + (game.tileSize.x * 0.3);
			eTile.position.y = tilePosY;
			eTile.position.z = this.object.position.z;
			
			s.add( eTile );
		}
		
		if(this.roadData.w == true) {
			var wTile = new THREE.Mesh( newTilegeometry, game.mats.road );
			wTile.position.x = this.object.position.x - (game.tileSize.x * 0.3);
			wTile.position.y = tilePosY;
			wTile.position.z = this.object.position.z;
			
			s.add( wTile );
		}
	},
};