function Tile(tileX, tileY, tileType, spriteX, spriteY, truckStart) { // Tiles should own their x/y location
    return {
        x: tileX,
        y: tileY,
        type: tileType,
        spriteDX: spriteX,
        spriteDY: spriteY,
        spriteDW: (spriteX + game.tileSize.x),
        spriteDH: (spriteY + game.tileSize.y),
        hasTruck: false,
        alarmVal: 0,
		truckCanStart: truckStart, // If a new truck can be placed on this tile
        //tileColor: "#090",
    
        drawTile: function(board) {
            if(this.type == 'h') {
                board.fillStyle = "#090";
            } else if(this.type == 'r') {
                board.fillStyle = "#909";
            }
            board.fillRect(this.x, this.y, game.tileSize.x, game.tileSize.y);
			//draw that image sprite
			board.drawImage(spriteTileImg,
				this.spriteDX, this.spriteDY, // top corner loc of sub - this is the sub offset locs
				game.tileSize.x, game.tileSize.y, // w/ of sub - needs to be full image size
				this.x, this.y, // top corner on canvas
				game.tileSize.x,game.tileSize.y); // width of canvas - the size of the sprite on the canvas
				
				/*
				The above works!
				TOP CORNERS ARE SET by DX/DY VAL
				Leave the width of the sub and canvas THE SAME
				TOP CORNER IS THE X/Y
				Leave the width of the sub and canvas THE SAME
				*/
				
				
				
			/*board.drawImage(spriteTileImg,
				this.x, this.y,
				game.tileSpritesheet.x, game.tileSpritesheet.y,
				this.spriteDX, this.spriteDY,
				this.spriteDW, this.spriteDH);*/
            // If this is what the mouse is hovering over, add a border too!
            if((game.cursor.x > this.x && game.cursor.x < (this.x + game.tileSize.x)) &&
                (game.cursor.y > this.y && game.cursor.y < (this.y + game.tileSize.y))) {
                //console.log("Rolled over a tile at: "+this.x+", "+this.y);
				board.fillStyle = "rgba(0, 0, 0, "+0.3+")";
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