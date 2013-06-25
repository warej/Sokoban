function game () {
	this.levelNo = 0;
	this.startTime = 0;
}

game.prototype.start = function () {
	this.startTime = new Date().getTime();
	this.scene = new menu();
};

game.prototype.drawScene = function () {
	this.scene.draw();
	this.drawTime();
	this.drawScore();
};

game.prototype.drawScore = function () {
	
};

game.prototype.drawTime = function () {
	
};