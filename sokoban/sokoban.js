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
}

Sokoban.prototype.start = function () {

	// Po pobraniu ładowane są tekstury
	initTextures();

	this.startTime = new Date().getTime();

	this.scene = new menu();

    // Po załadowaniu znika ekran ładowania gry
    $("#loadingPage").fadeOut(1000);
};

Sokoban.prototype.draw = function () {
	this.scene.draw();
	this.drawTime();
	this.drawScore();
};

Sokoban.prototype.animate = function () {

}

Sokoban.prototype.drawScore = function () {

};

Sokoban.prototype.drawTime = function () {

};