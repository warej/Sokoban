function Game () {
	this.levelNo = 0;
	this.startTime = 0;
}

Game.prototype.start = function () {
	$('#loadingPage').fadeOut(1000);
	initTextures();
	this.startTime = new Date().getTime();
	this.scene = new menu();
};

Game.prototype.draw = function () {
	this.scene.draw();
	this.drawTime();
	this.drawScore();
};

Game.prototype.drawScore = function () {
	
};

Game.prototype.drawTime = function () {
	
};