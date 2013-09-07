function Menu (game) {
    this.game = game;
}

Menu.prototype.load = function() {
    // Przechwytuj obsługę klawiszy
    log.d("Ładowanie obsługi klawiszy");
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

};