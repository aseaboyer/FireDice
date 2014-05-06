function Truck(trayVals) {
    return {
        inPlay: true, // if the truck is on a tile
		x: 0, // tile in where it resides
		y: 0,
		trayVal: trayVals,
		held: false, // if the player is 'holding' the truck
		place: function(newX,newY) {
			this.x = newX;
			this.y = newY;
			this.held = false;
		},
		pickup: function() {
			this.x = newX;
			this.y = newY;
			this.held = true;
		},
		drawTruck: function(board, tileDims) {
			if(this.inPlay) {
				board.fillRect( (this.x * tileDims.x), (this.y *tileDims.y),
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