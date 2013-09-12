
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


/*	Konstruktor klasy Level.	*/
function Level (gra, nr) {
	//	Numer poziomu
	this.number = nr;

	//	Sumaryczny (odliczenie pauz) czas gry
	this.totalTime = 0;

	//	Czy gra jest spauzowana
	this.paused = false;

	//	Obiekt nadrzędny
	this.game = gra;

	//	Sposób liczenia wyniku:
	//	każde przesunięcie pionka inkrementuje wynik.
	this.score = 0;

	//	Macierze przekształceń, które są jednakowe dla wszystkich obiektów
	//mat4.perspective(55, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, P);
	//mat4.identity(V);

	//	Pole na id obiektu playera
	this.player = null;

	//	Przesunięcia figur na planszy
	this.xOffset = -9.5;
	this.zOffset = 9.5;

	//	Załadowanie obiektów
	this.objects = [];
	this.load();

	//	Stworzenie planszy
	this.plansza = new Array (20);
	for (var i=0; i < 20; i++) {
		this.plansza[i] = new Array (20);
	}


	this.loadLvl();
};	/*	Level()	*/

/*	Funkcja ładująca wszystkie potrzebne modele	*/
Level.prototype.load = function () {
	//	Ładowanie modeli
	this.game.loadJSON("sword");
	if (this.game.models["sword"]) {
		log.d("OK");
	}
	this.game.loadJSON("proste");
	if (this.game.models["proste"]) {
		log.d("OK");
	}
	this.game.loadJSON("floor2");
	if (this.game.models["floor2"]) {
		log.d("OK");
	}
	this.game.loadJSON("wall");
	if (this.game.models["wall"]) {
		log.d("OK");
	}
	this.game.loadJSON("box");
	if (this.game.models["box"]) {
		log.d("OK");
	}

	var mMatrix = [];

	//	Ładowanie podłogi
	mMatrix = [];
	mat4.identity(mMatrix);
	this.addObject("floor2", "grass", mMatrix);

	//	Ładowanie ścian
	//mMatrix = [];
	//mat4.identity(mMatrix);
	//this.addObject("walls2", "brick", mMatrix);
	//    Ładowanie ścian
    mMatrix = [];
    mat4.identity(mMatrix);
    this.addObject("wall", "brick", mMatrix);

    mMatrix = [];
    mat4.identity(mMatrix);
    mat4.rotate(mMatrix, degToRad(90), [0.0, 1.0, 0.0]);
    this.addObject("wall", "brick", mMatrix);

    mMatrix = [];
    mat4.identity(mMatrix);
    mat4.rotate(mMatrix, degToRad(180), [0.0, 1.0, 0.0]);
    this.addObject("wall", "brick", mMatrix);

    mMatrix = [];
    mat4.identity(mMatrix);
    mat4.rotate(mMatrix, degToRad(270), [0.0, 1.0, 0.0]);
    this.addObject("wall", "brick", mMatrix);

	//	Ładowanie mieczyka 1
	mMatrix = [];
	mat4.identity(mMatrix);
	mat4.translate(mMatrix, [-10.0, 2.0, -10.0]);
	this.addObject("sword", "crate", mMatrix);

	//	Ładowanie mieczyka 2
	mMatrix = [];
	mat4.identity(mMatrix);
	mat4.translate(mMatrix, [-10.0, 2.0, 10.0]);
	this.addObject("sword", "brick", mMatrix);

	//	Ładowanie mieczyka 3
	mMatrix = [];
	mat4.identity(mMatrix);
	mat4.translate(mMatrix, [10.0, 2.0, 10.0]);
	this.addObject("sword", "crate", mMatrix);

	//	Ładowanie mieczyka 4
	mMatrix = [];
	mat4.identity(mMatrix);
	mat4.translate(mMatrix, [10.0, 2.0, -10.0]);
	this.addObject("sword", "brick", mMatrix);
};	/*	Level.load()	*/


/*	Funkcja ładująca poziom	*/
Level.prototype.loadLvl = function () {
	var request = new XMLHttpRequest();
	var callback = this;
	var path = "sokoban/level" + this.number + ".txt";
	log.d("Loading file " + path);
	request.open("GET", path);
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			callback.handleLevel(request.responseText);
		}
	}
	request.send();
};	/*	Level.loadLvl()	*/


/*	Funkcja obsługująca pobrany poziom	*/
Level.prototype.handleLevel = function (data) {
	var lines = data.split("\n");
	var z = 0;
	var xOffset = this.xOffset;
	var zOffset = this.zOffset;
	for (var i = 0; i < lines.length; i++) {
		var vals = lines[i].replace(/^\s+/, "").split(/\s+/);
		if (vals.length >= 20 && vals[0] != "//") {
			for (j = 0; j < 20; j++) {
				switch (vals[j]) {
					case '*':
						//	Ładowanie kawałka muru
						var fig = {};
						var mMatrix = [];

						mat4.identity(mMatrix);
						mat4.translate(mMatrix, [xOffset + j, 0.5, zOffset - z]);
						fig.index = this.addObject("box", "brick", mMatrix);

						fig.type = "wall";
						this.plansza[j][z] = fig;
						break;
					case '-':	//	nic
						this.plansza[j][z] = null;
						break;
					case 'X':	//	cel
						var fig = {};

						fig.type = "target";
						fig.index = -1;

						this.plansza[j][z] = fig;
						break;
					case '$':
						//	Ładowanie skrzyni
						var fig = {};
						var mMatrix = [];

						mat4.identity(mMatrix);
						mat4.translate(mMatrix, [xOffset + j, 0.5, zOffset - z]);
						fig.index = this.addObject("box", "crate", mMatrix);

						fig.type = "box";
						this.plansza[j][z] = fig;
						break;
					case 'P':
						//	Ładowanie playera
						var fig = {};
						mMatrix = [];
						this.player = {};

						//	obiekt
						this.player.x = j;
						this.player.z = z;
						mat4.identity(mMatrix);
						mat4.translate(mMatrix, [xOffset + this.player.x, 0.5, zOffset - this.player.z]);
						this.player.id = this.addObject("proste", "brick", mMatrix);
						break;
				}
			}
			z++;
		}
	}
};	/*	Level.handleLevel()	*/

/*	Funkcja dodająca nowy obiekt	*/
Level.prototype.addObject = function (modelName, textureName, mMatrix) {
	var i = this.objects.length;
	var newObject = {};

	//	Ustawianie modelu
	newObject.model = this.game.models[modelName];
	if (!newObject.model) {
		log.e("Brak modelu " + modelName);
	}

	//	Ustawianie id tekstury
	newObject.textureId = this.game.texturesNumbers[textureName];

	//	Ustawianie macierzy M
	newObject.M = mMatrix;

	if (!newObject.model) {
		log.d("Nie można załadować modelu " + modelName);
	}

	//	Zapisanie obiektu!
	this.objects[i] = newObject;

	//	Zwraca index dodanego obiektu
	return i;
};	/*	Level.addObject()	*/


/*	Level.draw()	*/
Level.prototype.draw = function () {
	//	Wyzerowanie macierzy
	mat4.perspective(55, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, P);
	mat4.identity(M);
	mat4.identity(V);


	//	Ustawienie macierzy widoku - kamery
	mat4.rotate(V, degToRad(-pitch), [1, 0, 0]);
	mat4.rotate(V, degToRad(-yaw), [0, 1, 0]);
	mat4.translate(V, [-xPos, -yPos, -zPos]);


	//	Objects
	for (i = 0; i < this.objects.length; i++) {
		this.drawObject(this.objects[i]);
	}
};	/*	Level.draw()	*/


/*	Metoda rysująca obiekt	*/
Level.prototype.drawObject = function (obj) {
	this.game.drawModel(obj.model, obj.M, obj.textureId);
};	/*	Level.drawObject()	*/


/*		*/
Level.prototype.animate = function () {
	animate();
};	/*	Level.animate()	*/

/*	Level.run()	*/
Level.prototype.run = function () {
	log.d("Startuję poziom " + this.number);
	this.startTime = new Date().getTime();
};  /*	Level.roun()	*/


/*	Level.handleKeys()	*/
Level.prototype.handleKeys = function(first_argument) {
	//	Ruch kamerą: C + klawisze sterujące
	//	Co do tego, że po puszczeniu najpierw C ruch się blokuje powiem tak:
	//	"It's not a bug. It's a feature" xD
	if (currentlyPressedKeys[67]) {	// key C
		if (currentlyPressedKeys[38]) { // GÓRA
			pitchRate = 0.05;
		} else if (currentlyPressedKeys[40]) { // DÓL
			pitchRate = -0.05;
		} else {
			pitchRate = 0;
		}

		if (currentlyPressedKeys[37]) { // LEWO
			yawRate = 0.1;
		} else if (currentlyPressedKeys[39]) { // PRAWO
			yawRate = -0.1;
		} else {
			yawRate = 0;
		}

		if (currentlyPressedKeys[89]) { //key Y
			speed = 0.01;
		} else if (currentlyPressedKeys[72]) { // key H
			speed = -0.01;
		} else {
			speed = 0;
		}

		if (currentlyPressedKeys[71]) { //key G
			speedBok = 0.01;
		} else if (currentlyPressedKeys[74]) { // key J
			speedBok = -0.01;
		} else {
			speedBok = 0;
		}

		if (currentlyPressedKeys[33]) { //key PageUp
			speedPion = 0.01;
		} else if (currentlyPressedKeys[34]) { // key PageDown
			speedPion = -0.01;
		} else {
			speedPion = 0;
		}
	}
	else {	//	Z jakichś powodów nie działa ;p
		//	Góra
		if (currentlyPressedKeys[38]) {
			speedPlayerX = 0.01;
		} else
		//	Dół
		if (currentlyPressedKeys[40]) {
			speedPlayerX = -0.01;
		}
		else {
			speedPlayerX = 0;
		}

		//	Lewo
		if (currentlyPressedKeys[37]) {
			currentlyPressedKeys[37] = false;
			this.moveLeft();
		} else
		// Prawo
		if (currentlyPressedKeys[39]) {
			speedPlayerZ = -0.01;
		}
		else {
			speedPlayerZ = 0;
		}
	}

	//	W
	if (currentlyPressedKeys[87]) {
		speedPlayerX = 0.01;
	} else
	//	S
	if (currentlyPressedKeys[83]) {
		speedPlayerX = -0.01;
	}
	else {
		speedPlayerX = 0;
	}

	//	A
	if (currentlyPressedKeys[65]) {
		speedPlayerZ = 0.01;
	} else
	// D
	if (currentlyPressedKeys[68]) {
		speedPlayerZ = -0.01;
	}
	else {
		speedPlayerZ = 0;
	}

	//	ESC
	if (currentlyPressedKeys[27]) {
		currentlyPressedKeys[27] = false;
		this.pause();
	}
};	/*	Level.handleKeys()	*/


/*	Rusz pionkiem w lewo	*/
Level.prototype.moveLeft = function () {
	// Odświeżenie pozycji gracza
	if (this.player && this.player.x > 0) {
		var oldX = this.player.x;
		var oldZ = this.player.z;
		log.d("x: " + oldX + ", z: " + oldZ);
		if (this.plansza[oldX - 1][oldZ] == null) {
			//	Puste pole - przesuń pionka
			this.player.x--;
			log.d("Puste pole");
		}
		else if (this.plansza[oldX - 1][oldZ].type == "box" && (oldX > 1) && (this.plansza[oldX - 2][oldZ] == null)) {
			log.d("Przesun");
			//	Box do przesunięcia
			var box = this.objects[this.plansza[oldX - 1][oldZ].index];
			//	Przesuń box
			this.plansza[oldX - 2][oldZ] = this.plansza[oldX - 1][oldZ];
			this.plansza[oldX - 1][oldZ] = null;
			mat4.identity(box.M);
			mat4.translate(box.M, [this.xOffset + oldX - 2, 0.5, this.zOffset - oldZ]);

			//	Przesuń pionka
			this.player.x--;
		}
		else if (this.plansza[oldX - 1][oldZ].type == "target") {
			log.d("target");
			//	Coś innego TODO
		}

		//	Przerysuj pozycję
		mat4.identity(this.objects[this.player.id].M);
		mat4.translate(this.objects[this.player.id].M, [this.xOffset + this.player.x, 0.5, this.zOffset - this.player.z]);
	}
};	/* Level.moveLeft() */


/*	Level.pause()	*/
Level.prototype.pause = function () {
	log.i("Pausa!");
	this.totalTime += new Date().getTime() - this.startTime;
	this.paused = true;
	this.game.lastState = this;
	this.game.scene = new Menu(this.game);
	this.game.scene.run();
};	/*	Level.pause()	*/

