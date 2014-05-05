function Truck(trayVals) {
    return {
        inPlay: false, // if the truck is on a tile
		x: 0, // tile in where it resides
		y: 0,
		trayVal: trayVals,
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
				board.fillStyle = "#900"; // different if the truck is on stage
				board.fillRect( this.trayVal.x, this.trayVal.y,
					this.trayVal.width, this.trayVal.height);
			} else {
				// figure out how we are going to tray it
			}
		},
		drawTruckTray: function(board) {
			board.fillStyle = "#900"; // different if 
			board.fillRect( (this.x + (game.tileSize.x * 0.25)), (this.y + (game.tileSize.y * 0.25)),
					(game.tileSize.x * 0.5), (game.tileSize.y * 0.5) );
		},
    };
}