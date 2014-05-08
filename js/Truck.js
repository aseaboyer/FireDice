function Truck(trayVals) {
    return {
        inPlay: true, // if the truck is on a tile
		x: 0, // TILE in where it resides
		y: 0,
		trayVal: trayVals,
		held: false, // if the player is 'holding' the truck
		place: function(newX,newY) {
			this.x = newX;
			this.y = newY;
			this.held = false;
		},
		pickup: function() {
			this.held = true;
		},
		drawTruck: function(board, tileDims) {
			if(this.inPlay) {
				board.fillStyle = "#900";
				board.fillRect( (this.x * tileDims.x) + (tileDims.x * 0.25), (this.y *tileDims.y) + (tileDims.y * 0.25),
					(tileDims.x * 0.5), (tileDims.y * 0.5) );
			}
		},
		drawTruckTray: function(board) {
			board.fillStyle = "#900"; // different if the truck is on stage
			board.fillRect( this.trayVal.x, this.trayVal.y,
				this.trayVal.width, this.trayVal.height);
		},
    };
}