function Tile(tileX, tileY, tileType, spriteX, spriteY, truckStart, houseStart, tileSizeX, tileSizeY) {
    return {
        x: (tileX * tileSizeX),
        y: (tileY * tileSizeY),
        xNum: tileX, // Tiles should own their x/y location
        yNum: tileY,
        type: tileType,
        spriteDX: spriteX,
        spriteDY: spriteY,
        spriteDW: (spriteX + game.tileSize.x), // pass the tile sizes through to this?
        spriteDH: (spriteY + game.tileSize.y),
        hasTruck: false,
        alarmVal: 0,
		hasHouse: houseStart || false, // set to false if the house hits 4 alarms!
		truckCanStart: truckStart || false, // If a new truck can be placed on this tile
    
        drawTile: function(board, spriteTileImg) {
			
			if(this.type == 'h') {
                board.fillStyle = "#090";
            } else if(this.type == 'r') {
                board.fillStyle = "#909";
            }
            board.fillRect(this.x, this.y, game.tileSize.x, game.tileSize.y);
			//draw that image sprite
		/*	board.drawImage(spriteTileImg,
				this.spriteDX, this.spriteDY, // top corner loc of sub - this is the sub offset locs
				game.tileSize.x, game.tileSize.y, // w/ of sub - needs to be full image size
				this.x, this.y, // top corner on canvas
				game.tileSize.x,game.tileSize.y); // width of canvas - the size of the sprite on the canvas
				*/
            if((game.cursor.x > this.x && game.cursor.x < (this.x + game.tileSize.x)) &&
                (game.cursor.y > this.y && game.cursor.y < (this.y + game.tileSize.y))) {
                //console.log("Rolled over a tile at: "+this.x+", "+this.y);
				board.fillStyle = "rgba(0, 0, 0, "+0.3+")";
				board.fillRect(this.x, this.y, game.tileSize.x, game.tileSize.y);
            }
			//this.drawHouse(board); // hold for now
			this.drawFire(board);
        },
		drawHouse: function(board) { // draw the note in the UI tray
			board.fillStyle = "#a0522d"; // different if the truck is on stage
		/*	board.fillRect( this.trayVal.x, this.trayVal.y,
				this.trayVal.width, this.trayVal.height);*/
			board.fillStyle = "#8b4513"; // different if the truck is on stage
		/*	board.fillRect( this.trayVal.x, this.trayVal.y,
				this.trayVal.width, this.trayVal.height);*/
		},
		drawFire: function(board) { // draw the note in the UI tray
			/*if(this.hasHouse) {
				board.fillStyle = "#900"; // different if the truck is on stage
				board.fillText(this.alarmVal, (this.x + (game.tileSize.x * 0.5)), (this.y + (game.tileSize.y * 0.5)));
			} else {
				board.fillStyle = "#999"; // different if the truck is on stage
				board.fillText("-", (this.x + (game.tileSize.x * 0.5)), (this.y + (game.tileSize.y * 0.5)));
			}*/
			board.fillStyle = "#900"; // different if the truck is on stage
			board.fillText(this.type, (this.x + (game.tileSize.x * 0.5)), (this.y + (game.tileSize.y * 0.5)));
		},
		startFire: function() { // if it's on fire, increase it, return info on if it's on fire or not
			this.alarmVal = 1;
		//	console.log("Fire request recieved for " + this.x + ", " + this.y)
		},
		updateFlame: function(failAlarmVal, truckList, tileSize) {
			var extinguishingTile = false;
			
			if(this.alarmVal > 0) { // if it's on fire, increase it
				var truckCount = truckList.length;
				for(var i=0; i < truckCount; i++) { //check to see if there's a truck nearby
					var tileCount = truckList[i].truckHosing.length;
					for(var j=0; j < tileCount; j++) { //check to see if there's a truck nearby
						var testX = getRoundedToTileSize( this.x, tileSize );
						var testY = getRoundedToTileSize( this.y, tileSize );
					//	console.log("Checking to see if the following obj matches "+
					//		(this.x / tileSize) +", "+(this.y / tileSize)+" TILESIZE " + tileSize);
					//	console.log(truckList[i].truckHosing[j]);
						if(truckList[i].truckHosing[j].x == (this.x / tileSize.x) 
							&& truckList[i].truckHosing[j].y == (this.y / tileSize.y)) {
							extinguishingTile = true;
						}
					}
				}
				if(extinguishingTile) {
					this.alarmVal--;
				} else {
					this.alarmVal++;
				}
			}
			if(this.alarmVal >= failAlarmVal) {
				this.alarmVal = 0;
				this.hasHouse = false;
			}
			
			// return info on if it's on fire or not
			if(!this.hasHouse) { return "-"; } 
			return this.alarmVal;
		},
    };
}