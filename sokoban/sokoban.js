/*
 *	author: Warej & Radek
 *	state: 	TODO
 *
 *	Główna klasa gry
 *
 */


// Obsługa kamery:
var pitch = -40;
var pitchRate = 0;

var yaw = 245;
var yawRate = 0;

var xPos = -15;
var yPos = 10;
var zPos = -5;

var speed = 0;
var speedBok = 0;


// Obsługa gracza:
var xPlayer = 0;
var zPlayer = 0;

var speedPlayerX = 0;
var speedPlayerZ = 0;
 


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
	//document.getElementById("konsola2").textContent = "Sokoban animate działa ";
	
	animate();
	
	return null;
}

Sokoban.prototype.drawScore = function () {
	
};

Sokoban.prototype.drawTime = function () {
	
};