function Truck(trayVals) {
    return {
        inPlay: false, // if the truck is on a tile
		x: 0, // TILE in where it resides
		y: 0,
		trayVal: trayVals,
		held: false, // if the player is 'holding' the truck
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
		},
		pickup: function() {
			this.held = true;
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