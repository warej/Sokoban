/*
 *	author: Warej & Radek
 *	state: 	TODO
 *
 *	Główna klasa gry
 *
 */


function Sokoban () {
	this.levelNo = 0;
	this.startTime = 0;
	this.running = false;
}

Sokoban.prototype.start = function () {

	this.running = true;

	this.startTime = new Date().getTime();

	this.scene = new menu();

    // Po załadowaniu znika ekran ładowania gry
    $("#loadingPage").fadeOut(1000);
};

Sokoban.prototype.draw = function () {

	this.drawTime();
	this.drawScore();
};

Sokoban.prototype.animate = function () {
	var tmp = 0;
};

Sokoban.prototype.drawScore = function () {

};

Sokoban.prototype.drawTime = function () {

};