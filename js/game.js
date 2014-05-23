var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var spriteTileImg = new Image();

var playerData = new PlayerData();

var levelList = [
	{	number: 1,
		name: "Starting Town",
		file: "js/level1.js",
	},
	{	number: 2,
		name: "Starting Town",
		file: "js/level1.js",
	},
];

var game = {
	phase: "menu",
	phases: [ "load menu", "menu", "load level", "play", "win", "lost" ], // for ref. @aseaboyer
	changePhase: function(phaseName) {
		if(phaseName == "load") {
			this.level.loadLevel();
		}
	},
	frameRate: {
		thisFrame: new Date().getTime(),
		lastFrame: this.thisFrame,
		update: function() {
			this.lastFrame = this.thisFrame;
			this.thisFrame = new Date().getTime();
			//console.log(this.getFrameDiff());
		},
		getCurrentTime: function() {
			return new Date().getTime();
		},
		getFrameDiff: function() {
			return this.thisFrame - this.lastFrame;
		},
	},
	cursor: {
		x: 0,
		y: 0,
		holdingTruck: false,
		draw: function(board) {
			if(this.holdingTruck) { // draw a truck on the cursor
				board.fillStyle = "#900";
				board.fillRect( (this.x - (game.tileSize.x * .2)), (this.y - (game.tileSize.y * .2)),
					(game.tileSize.x * .4), (game.tileSize.y * .4) );
			}
		},
		withinBounds: function(x,y,w,h) { // rect is the { x,y,w,h }
			if( this.x >= x && this.x <= (x + w) && this.y >= y && this.y <= (y + h) ) {
				return true;
			}
			return false;
		},
	},
	ui: {
		draw: function(board, turns, houses) {
			this.drawTurnUI(board, turns);
			this.drawHousesLeftUI(board, houses);
			this.skipButton.draw(board);
		},
		drawTurnUI: function(b, t) {
			b.font = "bold 16px Arial";
			b.textAlign = 'right';
			b.fillStyle = "#ccc";
			b.fillText("Remaining Turns: "+t, 395, 20);
		},
		drawHousesLeftUI: function(b, h) {
			b.font = "bold 16px Arial";
			b.textAlign = 'right';
			b.fillStyle = "#ccc";
			b.fillText("Remaining Houses: " + h , 395, 40);
			b.fillText("Houses needed to win: " + game.level.housesLeftWins , 395, 60);
		},
		skipButton: {
			x: 250,
			y: 165,
			width: 100,
			height: 20,
			text: "Skip Turn",
			draw: function(b) {
				game.drawTextWithBackground(b, this.text, 
					this.x, this.y, this.width, this.height, 
					"#fff", "#900", "#25383c",
					game.cursor);
			/*	// Draw the bg box
				b.fillStyle = "#900";
				b.fillRect( this.x, this.y, this.width, this.height );
				
				// Draw the text
				b.fillStyle = "#fff";
				b.textAlign = "center";
				b.textBaseline = "middle";
				b.fillText(this.text, (this.x + (this.width * .5)), this.y + (this.height * .5));*/
			},
		},
		drawLogo: function(b) {
			b.font = "bold 24px Arial";
			b.textAlign = 'right';
			b.fillStyle = "#ccc";
			b.fillText("FireDice!" , 395, 40);
			b.font = "bold 14px Arial";
			b.fillText("by Andy Seaboyer" , 395, 60);
		},
	},
	boardSize: {
		x: 192,
		y: 192,
	},
	level: {
		name: '',
		remainingMoves: 0,
		remainingHouses: 0,
		housesLeftWins: 0,
		finishTurn: function() {
			this.remainingMoves--;
			if(this.remainingMoves <= 0) {
				console.log("Level finished!");
				// @aseaboyer
				// save to playerData and go to level load screen
				
			} else {
				this.startTurn();
			}
		},
		loadLevel: function(fileName) { // @aseaboyer
			// fire the ajax call
				// the finished callfires it's own changePhase to play
		},
		startTurn: function() {
			var flameUpChance = Math.random();
			var flamableHouses = new Array();
			
			var tileCount = game.tileArray.length;
			for(var x=0; x < tileCount; x++) {
				// Should increase the fire rating! and see what returns
				var tileRating = game.tileArray[x].updateFlame(levelData.fireDestroysOn, game.trucks, game.tileSize);
				if(tileRating == 0) {
					flamableHouses.push(game.tileArray[x]);
				}
			}
			
			// @aseaboyer - reduce the fire rating if a truck is fighting the fire!
			
			if(flameUpChance <= levelData.fireChance) {
			//	console.log("Fire up a " + flameUpChance + " from a level chance of " + levelData.fireChance);
				game.startFire(flamableHouses);
			}
			
			this.remainingHouses = this.countRemainingHouses(game.tileArray);
		},
		countRemainingHouses: function(tileArray) {
			var totalHouses = 0;
			var tileCount = tileArray.length;
			for(var x=0; x < tileCount; x++) {
				if(tileArray[x].hasHouse) { totalHouses++; }
			}
			return totalHouses;
		},
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
	"tileArray": new Array(),
	"spriteTileImg": new Image(),
	"trucks": new Array(),
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
			aTruck.place(tilePos);
			game.level.finishTurn();
			
		} else {
			//console.log("Truck returned, not dropped on a road.");
			aTruck.place();
		}
		this.cursor.holdingTruck = false;
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
			//console.log("Spawning a new truck the following points - option:"+(optionPicked));
			//console.log(spawnPoint);
		}
	},
	levelInit: function(startingMoves, housesLeftWins) {
		this.level.remainingMoves = startingMoves;
		this.level.remainingHouses = this.level.countRemainingHouses(game.tileArray);
		this.level.housesLeftWins = housesLeftWins;
	},
	startFire: function(tiles) {
		var numberOfTiles = tiles.length;
		var randomTileNum = Math.floor(Math.random() * numberOfTiles);
		tiles[randomTileNum].startFire();
		//console.log("Set a fire at: " + tiles[randomTileNum].x + ", " + tiles[randomTileNum].y + " number " + randomTileNum + " of " + numberOfTiles);
	},
	drawTextWithBackground: function(b, str, x, y, w, h, c, bc, abc, cursor) { // abc = active bg color
		var n;
		
		b.fillStyle = bc;
		if(abc != n) {
			if( cursor.x > x && cursor.x < (x + w) && cursor.y > y && cursor.y < (y + w) ) {
				b.fillStyle = abc;
			}
		}
		b.fillRect( x, y, w, h ); // Draw the bg box
		
		b.fillStyle = c;
		b.textAlign = "center";
		b.textBaseline = "middle";
		b.fillText(str, (x + (w * .5)), y + (h * .5));// Draw the text
	}
};
var levelData = {
	"levelName": "Starting Town",
	"trucks": 1,
	"fireChance": 0.25,
	"housesLeftWins": 2,
	"fireDestroysOn": 5,
	"tiles": [
		[
			{
				"type": "h",
				"spriteX": (64 * 6),
				"spriteY": (64 * 3),
				"houseStart": true,
				"truckStart": false,
			},
			{
				"type": "r",
				"spriteX": (64 * 6),
				"spriteY": (64 * 3),
				"houseStart": true,
				"truckStart": false,
			},
			{
				"type": "h",
				"spriteX": (64 * 6),
				"spriteY": (64 * 3),
				"houseStart": true,
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
				"houseStart": true,
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
				"houseStart": true,
				"truckStart": false,
			}
		]
	],
	"turns": {
		"win": 30,
		"current": 0,
		"events": {
			30: "new truck"
		}
	},
};


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
				levelData.tiles[y][x].truckStart,
				levelData.tiles[y][x].houseStart);
			game.tileArray[i] = newTile;
			i++;
		}
	}
	
	game.trucks = new Array(levelData.trucks);
	for(var x=0; x < game.trucks.length; x++) {
		game.trucks[x] = new Truck( game.trucksTray.trayPosition );
	}
	game.addTruck(game.trucks[0], levelData.tiles); // @aseaboyer - This should happen on the turn start phase
	
	spriteTileImg.src = game.tileSpritesheet.url;
	
	game.levelInit(levelData.turns.win, levelData.housesLeftWins);
	
	game.frameRate.update();
	
	console.log('game:');
	console.log(game);
	
	setInterval( mainloop, ONE_FRAME_TIME );
}

function Update() {
	game.frameRate.update();
/*
    if(game.currentEvent == "Place Truck") {
	//	console.log("Placing Truck");
	}
*/
}

function Draw() {
    clearFrame(context);
	
	if(game.phase == 'menu') {
		game.drawLogo(context);
		
	
	} else if(game.phase == 'play') {
		var tileCount = game.tileArray.length;
		for(var x=0; x < tileCount; x++) {
			game.tileArray[x].drawTile(context, spriteTileImg);
		}
		
		var truckCount = game.trucks.length;
		for(var x=0; x < truckCount; x++) {// now draw trucks
			game.trucks[x].drawTruck( context, game.tileSize );
		//	game.trucks[x].drawTruckTray( context );
		}
		
		if(game.cursor.x != 0 && game.cursor.y != 0) {
			game.cursor.draw(context);
		}
		
		game.ui.draw(context, game.level.remainingMoves, game.level.remainingHouses);
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
	
	//console.log("Tried to pickup from tile: ");
	//console.log(tileNum);
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
canvas.addEventListener('touchmove', trackTouch, false);
canvas.addEventListener('touchstart', touchDown, false);
canvas.addEventListener('touchend', touchUp, false);

function trackMouse(e) {
    game.cursor.x = e.clientX;
    game.cursor.y = e.clientY;
//    console.log(e.clientX+" "+e.clientY);
}
function mouseDown(e) {
	if(game.phase == 'menu') {
	
	
	} else if(game.phase == 'play') {
		if(game.cursor.holdingTruck == false) { // this should ALWAYS be false...
			if(game.cursor.withinBounds(0,0,game.boardSize.x,game.boardSize.y)) {
				var tilePos = getTileNumber(game.cursor, game.tileSize); // Get the tile position
				var truckCount = game.trucks.length;
				for(var x=0; x < truckCount; x++) { // now draw trucks
					if( game.trucks[x].x == tilePos.x && game.trucks[x].y == tilePos.y ) {
						//console.log("There's a truck there! Pick it up!");
						game.puckupTruck(game.trucks[x]);
					}
				}
			} else if(game.cursor.withinBounds(game.ui.skipButton.x, game.ui.skipButton.y,
				game.ui.skipButton.width, game.ui.skipButton.height)) {
				//console.log("Player hit the skip button");
				game.level.finishTurn();
			}
			// mark valid tiles to place truck?
		}
	}
}
function mouseUp(e) {
	if(game.phase == 'play') {
		if(game.cursor.holdingTruck) {
			game.dropTruck(game.cursor.holdingTruck);
		}
	}
}
function trackTouch(e) {
    game.cursor.x = e.clientX;
    game.cursor.y = e.clientY;
//    console.log(e.clientX+" "+e.clientY);
}
function touchDown(e) {
	if(game.phase == 'menu') {
		
	
	} else if(game.phase == 'play') {
		if(game.cursor.holdingTruck == false) { // this should ALWAYS be false...
			if(game.cursor.withinBounds(0,0,game.boardSize.x,game.boardSize.y)) {
				var tilePos = getTileNumber(game.cursor, game.tileSize); // Get the tile position
				var truckCount = game.trucks.length;
				for(var x=0; x < truckCount; x++) { // now draw trucks
					if( game.trucks[x].x == tilePos.x && game.trucks[x].y == tilePos.y ) {
						game.puckupTruck(game.trucks[x]);
					}
				}
			} else if(game.cursor.withinBounds(game.ui.skipButton.x, game.ui.skipButton.y,
				game.ui.skipButton.width, game.ui.skipButton.height)) {
				game.level.finishTurn();
			}
			// mark valid tiles to place truck?
		}
	}
}
function touchUp(e) {
	if(game.phase == 'play') {
		if(game.cursor.holdingTruck) {
			game.dropTruck(game.cursor.holdingTruck);
		}
	}
}

// Create a hashtable for turns/actions?

/* Core */