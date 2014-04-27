var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var game = storeJSON("js/game.json");
console.log('loaded game info:');
console.log(game);

var tileArray = new Array(
    'h','r','h',
    'h','r','r',
    'h','r','h'
);
var trucks = new Array(3);

/* Core */
function Start() {
    var i = 0;
    for(var x=0; x < 3; x++) {
        for(var y=0; y < 3; y++) {
            var newTile = Tile((x*game.tileSize.x),(y*game.tileSize.y), tileArray[i]);
            tileArray[i] = newTile;
            i++;
        }
    }
    for(var x=0; x < trucks.length; x++) {
        trucks[x] = new Truck();
    }
    console.log(game);
    console.log(trucks);
    console.log(tileArray);
}

function Update() {
    //console.log(new Date());
}

function storeJSON(fileURL) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", fileURL, true);
	xhr.onload = function() {
		return JSON.parse(this.responseText);
	};
	console.log("Load JSON FAILED");
	return "";
}

function Draw() {
    clearFrame();
    
    var tileCount = tileArray.length;
    for(var x=0; x < tileCount; x++) {
        tileArray[x].drawTile(context);
    }
    
    drawCursor();// now draw the cursor higlight - func
    
    // now draw trucks
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

// Bind events
canvas.addEventListener('mousemove', trackMouse, false);
/*
canvas.addEventListener('mousedown', mouseDown, false);
canvas.addEventListener('mouseup', mouseUp, false);
*/
function trackMouse(e) {
    game.cursor.x = e.clientX;
    game.cursor.y = e.clientY;
//    console.log(e.clientX+" "+e.clientY);
}
/*
function mouseDown(e) {
    pen.penDown();
}
function mouseUp(e) {
    pen.penUp();
}
*/

// Create a hashtable for turns/actions?

/* Core */

/* Classes */
function Truck() {
    return {
        residence: null, // which the tile the truck is on.
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
                console.log("Rolled over a tile at: "+this.x+", "+this.y);
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