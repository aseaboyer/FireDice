var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var game = {
	"cursor": {
		"x": 0,
		"y": 0,
		"holdingTruck": true,
	},
	"boardSize": {
		"x": 192,
		"y": 192,
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
	]
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
	
	trucks = new Array(levelData.trucks);
	for(var x=0; x < trucks.length; x++) {
		trucks[x] = new Truck( game.trucksTray.trayPosition );
	}
	trucks[0].place((64*1),(64*1));
	
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
		trucks[x].drawTruck(context);
    }
    
    drawCursor(context);// now draw the cursor higlight - func
}

function clearFrame(board) {
    board.clearRect(0, 0, game.canvasSize.x, game.canvasSize.y);
}

function drawCursor(board) {
	if(game.cursor.holdingTruck) { // draw a truck on the cursor
		board.fillStyle = "#900";
		board.fillRect( (game.cursor.x - (game.tileSize.x * .5)), (game.cursor.y - (game.tileSize.y * .5)),
			(game.tileSize.x * .2), (game.tileSize.y * .2) );
	}
	
//    var xStart = getRoundedToTileSize(game.cursor.x, game.tileSize.x);
//    var yStart = getRoundedToTileSize(game.cursor.y, game.tileSize.y);
}

function getRoundedToTileSize( val, tileSize ) { // don't really use this any longer?
    return Math.round((val/tileSize)*tileSize); // should return the x and y of the tile
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

function trackMouse(e) {
    game.cursor.x = e.clientX;
    game.cursor.y = e.clientY;
//    console.log(e.clientX+" "+e.clientY);
}
function mouseDown(e) {
	if(game.cursor.holdingTruck == false) {
		// check to see if a truck is on this tile
		// if so: pickupTruck(game.cursor.x, game.cursor.y);
		// mark valid tiles to place truck?
	}
}
function mouseUp(e) {
	if(game.cursor.holdingTruck) {
	//	dropTruck(game.cursor.x, game.cursor.y);
	}
}

function pickupTruck() {
	// check to see if a truck is on this tile. If so:
		// add it to game.cursor.holdingTruck if so
		// tell the truck
}

// Create a hashtable for turns/actions?

/* Core */