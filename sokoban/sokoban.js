/*
 *	author: Warej & Radek
 *	state: 	TODO
 *
 *	Główna klasa gry
 *
 */


/*		*/
function Sokoban () {
	//	Zaczynamy od poziomu zerowego
	this.levelNo = 0;
	this.startTime = 0;
	this.running = false;
	this.finished = false;
};	/*		Sokoban()	*/


/*	Sokoban.load()	*/
Sokoban.prototype.load = function () {
};/*	Sokoban.load()	*/


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

    //	Zmiana zmiennej start, żeby zaczęły działać f-cje animate(), draw() i ;przechwytywanie klawiszy.
    //	De facto start menu :)
	this.running = true;
};

Sokoban.prototype.draw = function () {
	//	Narysuj obecną scenę
	this.scene.draw();

	//	W menu nie wypisujemy czasu
	if (this.scene instanceof Level) {
		this.drawTime();
	}
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