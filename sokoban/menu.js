/**
 ** Klasa Menu służy do ładowania i obsługi menu
 **
 **
 **/


/*		*/
function Menu (gra) {
	this.game = gra;
	this.choice = 0;
	this.choices = 3;

	this.items = [];
	this.items[0] = this.runLevel;
	this.items[1] = this.runLevel;
	this.items[2] = this.finish;

	this.load();
};	/*	Menu()	*/


/*	Menu.draw()	*/
Menu.prototype.draw = function () {

};	/*	Menu.draw()	*/


/*  Menu.load()  */
Menu.prototype.load = function() {

};	/*	Menu.load()	*/


/*	Menu.run()	*/
Menu.prototype.run = function() {
	log.i("Witaj w menu!");
	gl.clearColor(0.35, 0.35, 0.4, 1.0);
	gl.enable(gl.DEPTH_TEST);
};	/*	Menu.run()	*/


/*	Menu.handleKeys()	*/
Menu.prototype.handleKeys = function () {
	if (currentlyPressedKeys[37] || currentlyPressedKeys[38]) {	//	Lewo/góra
		currentlyPressedKeys[37] = false;
		currentlyPressedKeys[38] = false;
		this.choice = (this.choice -1 +this.choices) %this.choices;
		log.d("current choice is " + this.choice);
	} else if (currentlyPressedKeys[39] || currentlyPressedKeys[40]) {	//	Prawo/dół
		currentlyPressedKeys[39] = false;
		currentlyPressedKeys[40] = false;
		this.choice = (this.choice +1 +this.choices) %this.choices;
		log.d("current choice is " + this.choice);
	} else if (currentlyPressedKeys[13] || currentlyPressedKeys[32]) {	//	Enter/spacja
		currentlyPressedKeys[13] = false;
		currentlyPressedKeys[32] = false;

		switch (this.choice) {
			case 0:
				this.continueLevel();
				break;
			case 1:
				this.runLevel(0);
				break;
			case 2:
				this.finish();
				break;
		}
	}
};	/*	Menu.handleKeys()	*/


/*	Menu.continueLevel()	*/
Menu.prototype.continueLevel = function () {
	if (this.game.lastState != null) {
		this.game.scene = this.game.lastState;
		this.game.lastState = null;
		this.game.scene.run();
	}
	else {
		this.runLevel(1);
	}
};	/*	Menu.continueLevel()	*/


/*	Menu.runLevel()	*/
Menu.prototype.runLevel = function (nr) {
	log.d("Runing level " + nr);
	//	Uruchom poziom numer 'nr'
	this.game.scene = new Level(this.game, nr);
	this.game.scene.run();
};	/*	Menu.runLevel()	*/


/*	Menu.finish()	*/
Menu.prototype.finish = function () {
	log.d("Finishing");
	this.game.running = false;
	this.game.finished = true;
	this.game.scene = null;
};	/*	Menu.finish()	*/