/*
 *	author: Warej & Radek
 *	state: 	TODO
 *
 *	Główna klasa gry
 *
 */



// Artur => Radek: Wiesz jak ja lubię globalki, nie? ;p

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
var speedPion = 0;


// Obsługa gracza:
var xPlayer = 0;
var zPlayer = 0;

var speedPlayerX = 0;
var speedPlayerZ = 0;



function Sokoban () {
	//	Zaczynamy od poziomu zerowego
	this.levelNo = 0;
	this.startTime = 0;
	this.running = false;
};	/*		Sokoban()	*/

/*	Sokoban.load()	*/
Sokoban.prototype.load = function () {
};/*	Sokoban.load()	*/

/*	Funkcja rozpoczynająca nową grę (wywoływana z menu)
 */
Sokoban.prototype.newGame = function () {
	// Zapisanie czasu startu
	this.startTime = new Date().getTime();

};

/*	Funkcja startująca całość i wywołująca menu
 */
Sokoban.prototype.start = function () {
	//	Funkcja ładująca wszystkie elementy sceny
	log.i("Ładowanie gry.");
	//this.load();	//	Docelowo

	// Załadowanie menu
	log.i("Ładuję menu.");
	this.scene = new Menu(this);

    // Po załadowaniu znika ekran ładowania gry
    $("#loadingPage").fadeOut(300);

    // Zmiana zmiennej start, żeby zaczęły działać f-cje animate() i draw()
	log.i("Start gry!");
	this.running = true;

	// Uruchomienie sceny
	this.scene.run();
};

Sokoban.prototype.draw = function () {
	this.scene.draw();

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