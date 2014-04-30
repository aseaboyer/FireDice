var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var game = ajax_get_json("js/game.json");

console.log("LOADING LEVEL DATA");
//var levelData = loadLevel("1");
var levelData = ajax_get_json("levels/level1.json");
console.log(levelData);

var tileArray = new Array();
var trucks = new Array(levelData.trucks);

/* Core */
function Start() {
    var i = 0;
    for(var x=0; x < levelData.tiles.length; x++) {
        for(var y=0; y < levelData.tiles[x].length; y++) {
            var newTile = Tile((x*game.tileSize.x),(y*game.tileSize.y), levelData.tiles[x][y]);
            tileArray[i] = newTile;
            i++;
        }
    }
    for(var x=0; x < trucks.length; x++) {
        trucks[x] = new Truck();
    }
	trucks[0].place(100,100);
    console.log(game);
    console.log(trucks);
    console.log(tileArray);
}

function Update() {
/*
    if(game.currentEvent == "Place Truck") {
	//	console.log("Placing Truck");
	}
*/
}

function Draw() {
    clearFrame();
    
    var tileCount = tileArray.length;
    for(var x=0; x < tileCount; x++) {
        tileArray[x].drawTile(context);
    }
	
    var truckCount = trucks.length;
    for(var x=0; x < truckCount; x++) {// now draw trucks
        trucks[x].drawTruck(context);
    }
    
    drawCursor();// now draw the cursor higlight - func
}

function clearFrame() {
    context.save(); // Store the current transformation matrix
    context.setTransform(1, 0, 0, 1, 0, 0); // Use the identity matrix while clearing the canvas
    context.clearRect(0, 0, game.window.x, game.window.y);
    context.restore(); // Restore the transform
}

function drawCursor() {
//    var xStart = getCursorTile(game.cursor.x, game.tileSize.x);
//    var yStart = getCursorTile(game.cursor.y, game.tileSize.y);
}

function getCursorTile( val, tileSize ) {
    return Math.round((val/tileSize)*tileSize);
}

var ONE_FRAME_TIME = 1000 / 60 ;
var mainloop = function() {
    Update(); // the logic
    Draw(); // the output
};
Start();
setInterval( mainloop, ONE_FRAME_TIME );

function loadLevel(levelNum) {
	var holder = ajax_get_json("levels/level1.json");
	console.log("Fetching : levels/level1.json");
	console.log(holder);
	
	return holder;
}

function ajax_get_json(fileURL) {
	var hr = new XMLHttpRequest();
	hr.open("GET", fileURL, true);
	hr.setRequestHeader("Content-type", "application/json", true);
	hr.onreadystatechange = function() {
	//	console.log(hr.readyState+" :: "+hr.status);
		if(hr.readyState == 4 && hr.status == 200) {
			return JSON.parse(hr.responseText);
		}
	}
	hr.send(null);
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
	if(game.holdingTruck == null) {
		pickupTruck(game.cursor.x, game.cursor.y);
	}
}
function mouseUp(e) {
	if(game.holdingTruck != null) {
	//	dropTruck(game.cursor.x, game.cursor.y);
	}
}

function pickupTruck() {
	// check to see if a truck is on this tile, add it to game.holdingTruck if so
}

// Create a hashtable for turns/actions?

/* Core */

/* Classes */
function Truck() {
    return {
        inPlay: false, // if the truck is on a tile
		x: 0, // tile in where it resides
		y: 0,
		held: false, // if the player is 'holding' the truck
		place: function(newX,newY) {
			this.x = newX;
			this.y = newY;
			this.inPlay = true;
			this.held = false;
		},
		pickup: function() {
			this.x = newX;
			this.y = newY;
			this.inPlay = false;
			this.held = true;
		},
		drawTruck: function(board) {
			if(this.inPlay == true) {
				board.fillStyle = "#900";
				board.fillRect( (this.x + (game.tileSize.x * 0.25)), (this.y + (game.tileSize.y * 0.25)),
					(game.tileSize.x * 0.5), (game.tileSize.y * 0.5) );
			} else {
				// figure out how we are going to tray it
			}
		}
    };
}
function Tile(tileX, tileY, tileType) { // Tiles should own their x/y location
    return {
        x: tileX,
        y: tileY,
        type: tileType,
        hasTruck: false,
        alarmVal: 0,
        //tileColor: "#090",
    
        drawTile: function(board) {
            if(this.type == 'h') {
                board.fillStyle = "#090";
            } else if(this.type == 'r') {
                board.fillStyle = "#909";
            }
            board.fillRect(this.x, this.y, game.tileSize.x, game.tileSize.y);
            
            // If this is what the mouse is hovering over, add a border too!
            if((game.cursor.x > this.x && game.cursor.x < (this.x + game.tileSize.x)) &&
                (game.cursor.y > this.y && game.cursor.y < (this.y + game.tileSize.y))) {
                //console.log("Rolled over a tile at: "+this.x+", "+this.y);
				board.fillStyle = "rgba(0, 0, 0, "+0.3+")";;
				board.fillRect(this.x, this.y, game.tileSize.x, game.tileSize.y);
            }
        },
        bounds: function() {
            return {
              x: this.x,
              y: this.y,
              xMax: (this.x + this.game.tileSize.x),
              xMax: (this.y + this.game.tileSize.y)
            };
        }
        
        
    };
/*
    update: function () {
        if(this.alarmVal > 0) {
            if(this.hasTruck) {
                this.alarmVal--;
            } else {
                if(this.alarmVal == 3) {
                    this.spreadFire();
                } else {
                    this.alarmVal++;
                }
            }
            if(this.alarmVal < 0) {
                this.alarmVal = 0;
            }
        }
    }
    
    spreadFire: function () {
        // up another nearby fire's alarm val (if that one's isn't already 3)
    }
*/
}
/* Classes */