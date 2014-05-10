var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var game = {
	"cursor": {
		"x": 0,
		"y": 0,
		"holdingTruck": false,
		draw: function(board) {
			if(game.cursor.holdingTruck) { // draw a truck on the cursor
				board.fillStyle = "#900";
				board.fillRect( (game.cursor.x - (game.tileSize.x * .2)), (game.cursor.y - (game.tileSize.y * .2)),
					(game.tileSize.x * .4), (game.tileSize.y * .4) );
			}
		},
	},
	"boardSize": {
		"x": 192,
		"y": 192,
	},
	"level": {
		"remainingMoves": 0,
	},
	"canvasSize": {
		"x": 400,
		"y": 192,
	},
	"tileSize": {
		"x": 64,
		"y": 64,
	},
	"tileSpritesheet": {
		"url": "img/tile_spritesheet.png",
		"x": 576,
		"y": 576,
	},
	"trucksAvailable": 0,
	"trucksTray": {
		"trayPosition": {
			"x": 212,
			"y": 20,
			"width": 20,
			"height": 20,
			"offset": 20,
		},
	},
	puckupTruck: function(aTruck) {
		this.cursor.holdingTruck = aTruck;
		aTruck.pickup();
	},
	dropTruck: function(aTruck) {
		var tilePos = getTileNumber(this.cursor, this.tileSize);
		// check to see if this is a valid spot to drop the truck
		var tileType = levelData.tiles[tilePos.x][tilePos.y].type == 'r';
		var tileDistance = (tilePos.x - tilePos.y) + (aTruck.x - aTruck.y);
		//console.log('On the truck drop: '+tilePos.x+', '+tilePos.y+' : '+aTruck.x+', '+aTruck.y+' = '+tileDistance);
			// equals 1 means it moves one actual spot and does move 0
		if( tileType && (tileDistance == 1 || tileDistance == -1) ) {
			console.log("Truck dropped on a road.");
			// Also need to make sure the landing spot is an one tile away in a compas direction
			aTruck.place(tilePos);
			this.cursor.holdingTruck = false;
		} else {
			console.log("Truck returned, not dropped on a road.");
			aTruck.place();
			this.cursor.holdingTruck = false;
		}
		
		// if so, drop it
		
		// or else return it
	},
	addTruck: function(aTruck, tileSets) {
		var validDropPoints = new Array();
		
		var tileCols = tileSets.length;
		for(var x=0; x < tileCols; x++) {
			var tileRows = tileSets[x].length;
			for(var y=0; y < tileRows; y++) {
				if(tileSets[y][x].truckStart) {
					validDropPoints[validDropPoints.length] = { 'x': x, 'y': y };
				}
			}
		}
		
		var optionPicked = Math.floor((Math.random() * validDropPoints.length))
		var spawnPoint = validDropPoints[optionPicked];
		if(validDropPoints.length > 0) { // find valid drop point
			aTruck.spawn( spawnPoint );
			console.log("Spawning a new truck the following points - option:"+(optionPicked));
			console.log(spawnPoint);
		}
	},
/*
function puckupTruck(truck) {
	
}

function dropTruck(truck) {
	truck.place();
	game.cursor.holdingTruck = false;
}
*/
};
var levelData = {
	"trucks": 1,
	"tiles": [
		[
			{
				"type": "h",
				"spriteX": (64 * 6),
				"spriteY": (64 * 3),
				"truckStart": false,
			},
			{
				"type": "r",
				"spriteX": (64 * 6),
				"spriteY": (64 * 3),
				"truckStart": false,
			},
			{
				"type": "h",
				"spriteX": (64 * 6),
				"spriteY": (64 * 3),
				"truckStart": false,
			}
		],
		[
			{
				"type": "h",
				"spriteX": (64 * 0),
				"spriteY": (64 * 1),
				"truckStart": true,
			},
			{
				"type": "r",
				"spriteX": (64 * 4),
				"spriteY": (64 * 0),
				"truckStart": false,
			},
			{
				"type": "r",
				"spriteX": (64 * 0),
				"spriteY": (64 * 1),
				"truckStart": true,
			}
		],
		[
			{
				"type": "h",
				"spriteX": (64 * 6),
				"spriteY": (64 * 3),
				"truckStart": false,
			},
			{
				"type": "r",
				"spriteX": (64 * 0),
				"spriteY": (64 * 3),
				"truckStart": false,
			},
			{
				"type": "h",
				"spriteX": (64 * 6),
				"spriteY": (64 * 3),
				"truckStart": false,
			}
		]
	],
	"turns": {
		"win": 30,
		"events": {
			30: "new truck"
		}
	},
};
var tileArray = new Array();
var trucks = new Array(levelData.trucks);
var spriteTileImg = new Image();

// WOULD BE NICE TO HAVE AN ASSET QUEUE TO MANAGE THE MAIN LOOP INTERVAL


/* Core */
function Start() {
	var i = 0;
	
	var tileCols = levelData.tiles.length;
	for(var x=0; x < tileCols; x++) {
		var tileRows = levelData.tiles[x].length;
		for(var y=0; y < tileRows; y++) {
			var newTile = Tile((x * game.tileSize.x), (y * game.tileSize.y),
				levelData.tiles[y][x].type,
				levelData.tiles[y][x].spriteX, levelData.tiles[y][x].spriteY,
				levelData.tiles[y][x].truckStart);
			tileArray[i] = newTile;
			i++;
		}
	}
	
	game.level.remainingMoves = levelData.turns.win;
	
	trucks = new Array(levelData.trucks);
	for(var x=0; x < trucks.length; x++) {
		trucks[x] = new Truck( game.trucksTray.trayPosition );
	}
	//trucks[0].place({x: 1,y: 1});
	game.addTruck(trucks[0], levelData.tiles);
	
	spriteTileImg.src = game.tileSpritesheet.url;
	
	console.log(game);
	console.log(trucks);
	console.log(tileArray);
	
	setInterval( mainloop, ONE_FRAME_TIME );
}

function Update() {
/*
    if(game.currentEvent == "Place Truck") {
	//	console.log("Placing Truck");
	}
*/
}

function Draw() {
    clearFrame(context);
	
	var tileCount = tileArray.length;
	for(var x=0; x < tileCount; x++) {
		tileArray[x].drawTile(context);
	}
	
    var truckCount = trucks.length;
    for(var x=0; x < truckCount; x++) {// now draw trucks
		trucks[x].drawTruck( context, game.tileSize );
		trucks[x].drawTruckTray( context );
    }
    
	if(game.cursor.x != 0 && game.cursor.y != 0) {
		game.cursor.draw(context);
	}
}

function clearFrame(board) {
    board.clearRect(0, 0, game.canvasSize.x, game.canvasSize.y);
}

function getRoundedToTileSize( val, tileSize ) { // don't really use this any longer?
    return Math.round((val/tileSize)*tileSize); // should return the x and y of the tile
}

function getTileNumber( vals, tileSize ) { // don't really use this any longer?
	var tileNum = {x:0, y:0}; // Math.round((val/tileSize)*tileSize);
		tileNum.x = parseInt(vals.x/tileSize.x);
		tileNum.y = parseInt(vals.y/tileSize.y);
	
	console.log("Tried to pickup from tile: ");
	console.log(tileNum);
    return tileNum; // should return the x and y of the tile
}

var ONE_FRAME_TIME = 1000 / 60 ;
var mainloop = function() {
    Update(); // the logic
    Draw(); // the output
};
Start();

function loadLevel(levelNum) {
	return ajax_get_json("levels/level"+levelNum+".json");
}

function ajax_get_json(fileURL) {
	var hr = new XMLHttpRequest();
	hr.open("GET", fileURL, false);
	hr.setRequestHeader("Content-type", "application/json", true);
	hr.send(null);
	hr.onreadystatechange = function() {
		console.log(hr);
		if(hr.readyState == 4 && hr.status == 200) {
			return JSON.parse(hr.responseText); // what if this triggered the main frame on completion? frustrating
		}
	}
}

// Bind events
canvas.addEventListener('mousemove', trackMouse, false);
canvas.addEventListener('mousedown', mouseDown, false);
canvas.addEventListener('mouseup', mouseUp, false);
canvas.addEventListener('touchmove', trackMouse, false);
canvas.addEventListener('touchstart', mouseDown, false);
canvas.addEventListener('touchend', mouseUp, false);

function trackMouse(e) {
    game.cursor.x = e.clientX;
    game.cursor.y = e.clientY;
//    console.log(e.clientX+" "+e.clientY);
}
function mouseDown(e) {
	if(game.cursor.holdingTruck == false) { // this should ALWAYS be false...
		var tilePos = getTileNumber(game.cursor, game.tileSize); // Get the tile position
		var truckCount = trucks.length;
		for(var x=0; x < truckCount; x++) {// now draw trucks
			if( trucks[x].x == tilePos.x && trucks[x].y == tilePos.y ) {
				console.log("There's a truck there! Pick it up!");
				game.puckupTruck(trucks[x]);
			}
		}
		// mark valid tiles to place truck?
	}
}
function mouseUp(e) {
	if(game.cursor.holdingTruck) {
		game.dropTruck(game.cursor.holdingTruck);
	}
}

// Create a hashtable for turns/actions?

/* Core */