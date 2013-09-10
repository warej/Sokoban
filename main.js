/**
 *  author: Warej
 *  status: done
 */

log = new Logger();
var game;

/*	Główna funkcja wywoływana po załadowaniu strony	*/
function main () {
	//  Utworzenie obiektu gry.
	log.i("Startuję grę.");
	game = new Sokoban();

	/*  Inicjalizacja gry - załadowanie shaderów, obiektów, tekstur itp
	 *  Tutaj sterowanie się rozdwaja: w jednym wątku idzie pobieranie plików, a w drugim rusza odświeżanie
	 */
	log.d("Inicjalizacja gry.");
	init(game);

	/*  tick() to funkcja, która we w miarę regularnych odstępach czasu wywołuje samą siebie,
	 *  ale tylko kiedy dana karta przeglądarki jest aktywna.
	 *  Stanowi główną pętlę programu.
	 */
	 //log.d("tick()");
	tick(game);
}	/*	main ()	*/


/*      */
function tick() {
	if (!game.finished) {
		//  Jeżeli gra nie jest jeszcze skończona, to przy kolejnym odświeżeniu ekranu wywołaj mnie ponownie
		requestAnimFrame(tick); //  z biblioteki 'webgl-utils'
	}


	if(game.running){
		// Sprawdzenie klawiatury
		handleKeys(game);

		//	Jeżeli gracz wyszedł z menu, to nie ma sensu dalej tickować, bo wywali błąd
		if (!game.scene) {
			return null;
		}

		// Przeliczenie stanu gry
		game.animate();

		// Przerysowanie gry
		game.draw();
	}
}   /*  tick()  */