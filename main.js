/**
 *  author: Warej
 *  status: done
 */

var game; // Główny obiekt całej gry

/*	Główna funkcja wywoływana po załadowaniu strony	*/
function main () {
    //  Utworzenie obiektu gry.
	game = new Sokoban();

	/*  Inicjalizacja gry - załadowanie shaderów, obiektów, tekstur itp
     *  Tutaj sterowanie się rozdwaja: w jednym wątku idzie pobieranie plików, a w drugim rusza odświeżanie
     */
    init(game);

	game.start();

    /*  tick() to funkcja, która we w miarę regularnych odstępach czasu wywołuje samą siebie,
     *  ale tylko kiedy dana karta przeglądarki jest aktywna.
     *  Stanowi główną pętlę programu.
     */
	tick();
}	/*	main ()	*/


/*      */
function tick() {
    //  Przy kolejnym odświeżeniu ekranu wywołaj mnie ponownie
    requestAnimFrame(tick); //  z biblioteki 'webgl-utils'

	// Sprawdzenie klawiatury
	handleKeys();

    // Przeliczenie stanu gry
    game.animate();

    // Przerysowanie gry
    game.draw();
}   /*  tick()  */