// workaround for chrome bug: http://code.google.com/p/chromium/issues/detail?id=35980#c12
if ( window.innerWidth === 0 ) { window.innerWidth = parent.innerWidth; window.innerHeight = parent.innerHeight; }

var camera, cameraControls, scene, renderer, projector;
var geometry, material, mesh;
var tiles = new Array();
var centerLoc = new THREE.Vector3(0,0,0);
var game = {
	tileSize: {
		x: 100,
		y: 50,
		z: 100,
	},
	roadHeight: 5,
	house: {
		dims: {
			x: 40,
			y: 40,
			z: 40,
		},
		offset: {
			x: 20,
			y: 0,
			z: 20,
		},
	},
	mouse: {
		isDown: {
			l: false,
			r: false,
		},
		position: {
			x: 0,
			y: 0,
		},
		dragStart: {
			x: 0,
			y: 0,
		},
		update: function() {
		
		},
	},
	mats: {
		tileMats: {
			inactive: new THREE.MeshLambertMaterial( { 
				color: 0x669933, 
				shading: THREE.FlatShading, 
				overdraw: 0.5
			} ),
			active: new THREE.MeshLambertMaterial( { 
				color: 0x336600, 
				shading: THREE.FlatShading, 
				overdraw: 0.5
			} ),
		},
		road: new THREE.MeshLambertMaterial( { 
			color: 0x666666, 
			shading: THREE.FlatShading, 
			overdraw: 0.5
		} ),
	},
};
var tiles = new Array();

init();
animate();

function init() {
/*	--- Camera ---	*/
	camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, - 500, 1000 );
	camera.position.x = 100;
	camera.position.y = 100;
	camera.position.z = 100;
/*	cameraControls = new THREE.OrbitControls( camera );
				cameraControls.damping = 0.2;
				cameraControls.addEventListener( 'change', animate );
*/

/*	--- Scene ---	*/
	scene = new THREE.Scene();
	clock = new THREE.Clock();
	projector = new THREE.Projector();
	
/*	--- Lighting ---	*/
	var ambientLight = new THREE.AmbientLight( 0xffffff );
	scene.add( ambientLight );

	var directionalLight = new THREE.DirectionalLight( 0xffffff );
	directionalLight.position.normalize();
	scene.add( directionalLight );
	
/*	--- Tiles ---	*/
	var newTilegeometry = new THREE.BoxGeometry( game.tileSize.x, game.tileSize.y, game.tileSize.z );

	var tileOffset = {
		x: (tileData.dims.x * 0.5) * game.tileSize.x,
		z: (tileData.dims.z * 0.5) * game.tileSize.z,
	};
	
	var numTiles = tileData.tiles.length;
	for(i = 0; i < numTiles; i++) {
		var newTile = new THREE.Mesh( newTilegeometry, game.mats.tileMats.inactive );
		
		newTile.position.x = (game.tileSize.x * tileData.tiles[i].position.x) - (tileOffset.x) ;
		newTile.position.z = (game.tileSize.z * tileData.tiles[i].position.z) - (tileOffset.z);
		
		newTile.controller = new Tile( newTile, tileData.tiles[i].hasHouse, tileData.tiles[i].truckStart, 
			tileData.tiles[i].hasRoad, tileData.tiles[i].road, tileData.tiles[i].position );
		newTile.controller.init(scene);
		scene.add( newTile );
		
		tiles.push(newTile); // Add the object to the tile Array
	}

	renderer = new THREE.CanvasRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( 0xffffff, 1);
	
	document.body.appendChild( renderer.domElement );

    createClickEvents();
}

function createClickEvents() {
	renderer.domElement.addEventListener('mousedown', function(event) {
		event.preventDefault();
		
		for (i = 0; i < tiles.length; i++) { // this might be better manage elsewhere for FPS
			tiles[i].controller.clicked(false); // disable any active tiles
		}
		
		var vector = new THREE.Vector3(
				renderer.devicePixelRatio * (event.pageX - this.offsetLeft) / this.width * 2 - 1,
				- renderer.devicePixelRatio * (event.pageY - this.offsetTop) / this.height * 2 + 1,
				0.5
			);

		var raycaster = projector.pickingRay( vector, camera );
		var intersects = raycaster.intersectObjects(tiles);
		
		if (intersects.length) {
			
			intersects[0].object.controller.clicked(true);
			
			
			console.log(intersects[0].object.controller.position);
			
			
		} else {
			//intersects = raycaster.intersectObjects(trucks); // else if interacted with a truck?
		
			console.log("Didn't click a tile, interact with world space?");
		}
	}, false);
}

function animate() {
	requestAnimationFrame( animate );
	
	renderer.render( scene, camera );
	
	this.camera.lookAt(centerLoc);
}