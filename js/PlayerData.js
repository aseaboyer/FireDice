function PlayerData() {
    return {
		name: "",
		currentLevel: 1,
		highScore: 0,
		gamesPlayed: 0,
		setHighScore: function(newScore) {
			if(newScore > this.highScore) {
				this.highScore = newScore;
			}
			return this.highScore;
		},
		getHighScore: function() {
			return this.highScore;
		},
		getCurrentLevel: function() {
			return this.currentLevel;
		},
		setCurrentLevel: function(newLevelNum) {
			if(newlevelNum > this.currentLevel) {
				this.currentLevel = newlevelNum;
			}
			this.gamesPlayed++;
		},
    };
}