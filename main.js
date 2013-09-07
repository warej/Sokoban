/**
 *  author: Warej
 *  status: done
 */

log = new Logger();

/*	Główna funkcja wywoływana po załadowaniu strony	*/
function main () {
    //  Utworzenie obiektu gry.
    log.i("Startuję grę.");
	var game = new Sokoban();

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
	//tick(game);
}	/*	main ()	*/


/*      */
function tick(game) {
    //  Przy kolejnym odświeżeniu ekranu wywołaj mnie ponownie
    requestAnimFrame(tick); //  z biblioteki 'webgl-utils'

	// Sprawdzenie klawiatury
	handleKeys();

	if(game.running){
		// Przeliczenie stanu gry
		game.animate();

		// Przerysowanie gry
		game.draw();
	}
}   /*  tick()  */