function PlayerData() {
    return {
		currentLevel: 1,
		highScore: 0,
		setHighScore: function(newScore) {
			if(newScore > this.highScore) {
				this.highScore = newScore;
			}
			return this.highScore;
		},
		getHighScore: function() {
			return this.highScore;
		},
    };
}