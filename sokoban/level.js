function level () {

}

level.prototype.load = function (no) {
    // Przechwytuj obsługę klawiszy
    log.d("Ładowanie obsługi klawiszy");
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

	this.objects = {};
};

level.prototype.draw = function () {

};