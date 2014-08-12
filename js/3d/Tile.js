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
		/*
		var houseMat = new THREE.MeshLambertMaterial( { 
			color: ( Math.random() * 0xffffff ), 
			shading: THREE.FlatShading, 
			overdraw: 0.5
		});
		*/
		var houseMat = new THREE.MeshNormalMaterial( { color: ( Math.random() * 0xffffff ), vertexColors: THREE.FaceColors, shading: THREE.FlatShading, overdraw: 0.5 } );
		var houseGeometry = new THREE.BoxGeometry( game.house.dims.x, game.house.dims.y, game.house.dims.z );
		var house = new THREE.Mesh( houseGeometry, houseMat ); // the house should be a random color
		
		house.position.x = this.object.position.x + game.house.offset.x;
		house.position.z = this.object.position.z + game.house.offset.z;
		house.position.y = this.object.position.y + game.tileSize.y + game.house.offset.y;
		
		s.add( house );
	},
	createRoad: function(s) { // @aseaboyer - maybe the roads should be material overlays....
		var tileThirds = { // ease the math later
				x: (game.tileSize.x / 3),
				z: (game.tileSize.z / 3),
				x2: ((game.tileSize.x / 3) * 2),
				z2: ((game.tileSize.z / 3) * 2),
		};
		
		var roadPoints = [];
		roadPoints.push( new THREE.Vector2 ( tileThirds.x, tileThirds.z ) );
		if(this.roadData.s) {
			roadPoints.push( new THREE.Vector2 ( 0, tileThirds.z ) );
			roadPoints.push( new THREE.Vector2 ( 0, tileThirds.z2 ) );
		}
		roadPoints.push( new THREE.Vector2 ( tileThirds.x, tileThirds.z2 ) );
		if(this.roadData.w) {
			roadPoints.push( new THREE.Vector2 ( tileThirds.x, game.tileSize.x ) );
			roadPoints.push( new THREE.Vector2 ( tileThirds.x2, game.tileSize.x ) );
		}
		roadPoints.push( new THREE.Vector2 ( tileThirds.x2, tileThirds.z2 ) );
		if(this.roadData.n) {
			roadPoints.push( new THREE.Vector2 ( game.tileSize.x, tileThirds.z2 ) );
			roadPoints.push( new THREE.Vector2 ( game.tileSize.x, tileThirds.z ) );
		}
		roadPoints.push( new THREE.Vector2 ( tileThirds.x2, tileThirds.z ) );
		if(this.roadData.e) {
			roadPoints.push( new THREE.Vector2 ( tileThirds.x2, 0 ) );
			roadPoints.push( new THREE.Vector2 ( tileThirds.x, 0 ) );
		}
		var roadShape = new THREE.Shape( roadPoints );

		var extrusionSettings = {
			amount:10, size: 30, height: 4, curveSegments: 3,
			bevelThickness: 1, bevelSize: 2, bevelEnabled: false,
			material: 0, extrudeMaterial: 1
		};

		var roadGeometry = new THREE.ExtrudeGeometry( roadShape, extrusionSettings ); // maybe we don't extrude but just apply it slightly above?

		var pavementMat = new THREE.MeshBasicMaterial( { color: 0x666666, vertexColors: THREE.FaceColors } );
		var pavementSidesMat = new THREE.MeshBasicMaterial( { color: 0x333333, vertexColors: THREE.FaceColors } );
		var roadMaterial = new THREE.MeshFaceMaterial( [ pavementMat, pavementSidesMat ] );

		var road = new THREE.Mesh( roadGeometry, roadMaterial );
		road.position.set(this.object.position.x + (game.tileSize.x * 0.5), game.tileSize.y ,this.object.position.z + (game.tileSize.z * 0.5));
		road.lookAt( new THREE.Vector3(
			this.object.position.x + (game.tileSize.x * 0.5), (game.tileSize.y + 100),this.object.position.z + (game.tileSize.z * 0.5) ) );
		s.add( road );
	},
};