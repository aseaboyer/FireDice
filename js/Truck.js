function Truck(trayVals) {
    return {
        inPlay: false, // if the truck is on a tile
		x: 0, // TILE in where it resides
		y: 0,
		dir: 'N', // used to control which facing direction the truck is using
		truckHosing: new Array(), // controls where the truck can hose right now
		trayVal: trayVals,
		held: false, // if the player is 'holding' the truck
		validDropPlaces: new Array(), // calculate once at the start of drag, clear on release
		spawn: function(dropSpot) {
			this.inPlay = true;
			this.place(dropSpot);
		},
		place: function(newCo) {
			var undef;
			if(newCo !== undef) {
				this.x = newCo.x;
				this.y = newCo.y;
			}
			this.held = false;
			
			// update the hosing vals (4 compass points)
			var newListings = new Array();
				newListings.push({x: this.x+1, y: this.y});
				newListings.push({x: this.x-1, y: this.y});
				newListings.push({x: this.x, y: this.y+1});
				newListings.push({x: this.x, y: this.y-1});
			this.truckHosing = newListings;
			
			this.validDropPlaces.length = 0;
		},
		pickup: function(tileArray, tileSizes) {
			this.held = true;
			
			// @aseaboyer - How to cleanly skim the tiles?
			
			// @aseaboyer - mark valid drop spots so we only calculate them once
			var validDropArray = new Array();
				// check to see if these are roads first
				// should also check to see if they aren't occupied!
				if(this.findValidTile(tileArray, tileSizes, this.x+1, this.y)) {
					validDropArray.push({dir:"right"}); }
				if(this.findValidTile(tileArray, tileSizes, this.x-1, this.y)) {
					validDropArray.push({dir:"left"}); }
				if(this.findValidTile(tileArray, tileSizes, this.x, this.y+1)) {
					validDropArray.push({dir:"down"}); }
				if(this.findValidTile(tileArray, tileSizes, this.x, this.y-1)) {
					validDropArray.push({dir:"up"}); }
			this.validDropPlaces = validDropArray;
			console.log("Can drop on:");
			console.log(validDropArray);
		},
		findValidTile: function(tiles, tileSizes, x, y) {
			var tilesLength = tiles.length;
			for(var i=0; i < tilesLength; i++) {
				// Also check if the tile doesn't hold a truck?
				if(tiles[i].x == (tileSizes.x * x) && tiles[i].y == (tileSizes.y * y)) {
					if(tiles[i].type == 'r') {
						return true;
					}
					return false;
				}
			}
			return false;
		},
		drawTruck: function(board, tileDims) {
			if(this.inPlay) {
				if(!this.held) {
					board.fillStyle = "#900";
				} else {
					board.fillStyle = "#9cc";
					
					context.beginPath();
					context.moveTo((this.x * tileDims.x) + (tileDims.x * 0.5), (this.y *tileDims.y) + (tileDims.y * 0.5));
					context.lineTo(game.cursor.x, game.cursor.y);
					context.lineWidth = 10;
					context.strokeStyle = '#900';
					context.stroke();
				}
				board.fillRect( (this.x * tileDims.x) + (tileDims.x * 0.25), (this.y *tileDims.y) + (tileDims.y * 0.25),
					(tileDims.x * 0.5), (tileDims.y * 0.5) );
			}
		},
		drawTruckTray: function(board) { // draw the note in the UI tray
			board.fillStyle = "#900"; // different if the truck is on stage
			board.fillRect( this.trayVal.x, this.trayVal.y,
				this.trayVal.width, this.trayVal.height);
		},
    };
}