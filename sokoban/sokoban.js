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

	this.startTime = new Date().getTime();

	this.scene = new menu();

    // Po załadowaniu znika ekran ładowania gry
    $("#loadingPage").fadeOut(0);
};

Sokoban.prototype.draw = function () {
	document.getElementById("konsola1").textContent = "Sokoban draw działa";
	drawScene();

	this.drawTime();
	this.drawScore();
};

Sokoban.prototype.animate = function () {
	
	
	document.getElementById("konsola2").textContent = "Sokoban animate działa ";
	
	return null;
}

Sokoban.prototype.drawScore = function () {
	
};

Sokoban.prototype.drawTime = function () {
	
};