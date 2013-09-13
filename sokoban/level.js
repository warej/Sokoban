
// Obsługa kamery:
var pitch = -35;
var pitchRate = 0;

var yaw = 355;
var yawRate = 0;

var xPos = -2;
var yPos = 10;
var zPos = 18;

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

	//	liczba boxów/targetów
	this.boxCounter = 0;

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
	this.game.loadJSON("target");
	if (this.game.models["target"]) {
		log.d("OK");
	}
	this.game.loadJSON("sun");
	if (this.game.models["sun"]) {
		log.d("OK");
	}

	var mMatrix = [];


	//	Ładowanie podłogi
	mMatrix = [];
	mat4.identity(mMatrix);
	this.addObject("floor2", "grass", mMatrix);


	//	Ładowanie ścian
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
    mat4.rotate(mMatrix, degToRad(45), [0.0, 1.0, 0.0]);
	this.addObject("sword", "sword_tex", mMatrix);


	//	Ładowanie mieczyka 2
	mMatrix = [];
	mat4.identity(mMatrix);
	mat4.translate(mMatrix, [-10.0, 2.0, 10.0]);
    mat4.rotate(mMatrix, degToRad(135), [0.0, 1.0, 0.0]);
	this.addObject("sword", "sword_tex", mMatrix);


	//	Ładowanie mieczyka 3
	mMatrix = [];
	mat4.identity(mMatrix);
	mat4.translate(mMatrix, [10.0, 2.0, 10.0]);
    mat4.rotate(mMatrix, degToRad(225), [0.0, 1.0, 0.0]);
	this.addObject("sword", "sword_tex", mMatrix);


	//	Ładowanie mieczyka 4
	mMatrix = [];
	mat4.identity(mMatrix);
	mat4.translate(mMatrix, [10.0, 2.0, -10.0]);
    mat4.rotate(mMatrix, degToRad(315), [0.0, 1.0, 0.0]);
	this.addObject("sword", "sword_tex", mMatrix);
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

						//	Podpinanie grafiki
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
						var mMatrix = [];

						//	Podpinanie grafiki
						mat4.identity(mMatrix);
						mat4.translate(mMatrix, [xOffset + j, 0.5, zOffset - z]);
						fig.index = this.addObject("target", "target_tex", mMatrix);

						//	Na targecie nie ma na razie niczego
						fig.fig = null;

						fig.type = "target";
						this.plansza[j][z] = fig;
						break;
					case '$':
						//	Ładowanie skrzyni
						var fig = {};
						var mMatrix = [];

						//	Mamy kolejnego boxa
						this.boxCounter++;

						//	Podpinanie grafiki
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
						this.player.id = this.addObject("box", "steel", mMatrix);
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
	if (this.paused) {
		return;
	}

	if (this.player != null && this.boxCounter == 0) {
		this.finish();
	}

	var timeNow = new Date().getTime();
	if (lastTime != 0) {
		var elapsed = timeNow - lastTime;

		// KAMERA:
		if (speed != 0) {
			xPos -= speed * elapsed * Math.sin(degToRad(yaw));
			zPos -= speed * elapsed * Math.cos(degToRad(yaw));
			yPos += speed * elapsed * Math.sin(degToRad(pitch));

			//joggingAngle += elapsed * 0.6; // 0.6 "fiddle factor" - makes it feel more realistic :-)
			//yPos = Math.sin(degToRad(joggingAngle)) / 20 + 0.4
		}

		if (speedBok != 0) {
			xPos -= speedBok * elapsed * Math.cos(degToRad(yaw));
			zPos -= speedBok * elapsed * Math.sin(degToRad(-yaw));
		}

		if (speedPion != 0) {
			yPos += speedPion * elapsed;
		}

		yaw += yawRate * elapsed;
		pitch += pitchRate * elapsed;
	}
	lastTime = timeNow;
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
			currentlyPressedKeys[38] = false;
			this.moveUp();
		} else
		//	Dół
		if (currentlyPressedKeys[40]) {
			currentlyPressedKeys[40] = false;
			this.moveDown();
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
			currentlyPressedKeys[39] = false;
			this.moveRight();
		}
		else {
			speedPlayerZ = 0;
		}
	}

	//	W
	if (currentlyPressedKeys[87]) {
		currentlyPressedKeys[87] = false;
		this.moveUp();
	} else
	//	S
	if (currentlyPressedKeys[83]) {
		currentlyPressedKeys[83] = false;
		this.moveDown();
	}
	else {
		speedPlayerX = 0;
	}

	//	A
	if (currentlyPressedKeys[65]) {
		currentlyPressedKeys[65] = false;
		this.moveLeft();
	} else
	// D
	if (currentlyPressedKeys[68]) {
		currentlyPressedKeys[68] = false;
		this.moveRight();
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
		var move = false;
		var box;
		var src;
		var dst;

		if (this.plansza[oldX - 1][oldZ] == null || (this.plansza[oldX - 1][oldZ].type == "target" && this.plansza[oldX - 1][oldZ].fig == null )) {
			//	Puste pole - przesuń pionka
			this.player.x--;
			log.d("Puste pole");
		}
		else if (this.plansza[oldX - 1][oldZ].type == "box" && (oldX > 1)) {
			//	Mamy boxa obok i nie jest dosunięty do samego końca
			if (this.plansza[oldX - 2][oldZ] == null) {
				//	Za boxem jest pusta przestrzeń
				log.d("Przesun");
				move = true;

				//	Box do przesunięcia
				box = this.objects[this.plansza[oldX - 1][oldZ].index];
				//	Przesuń box

				this.plansza[oldX - 2][oldZ] = this.plansza[oldX - 1][oldZ];
				this.plansza[oldX - 1][oldZ] = null;
				//	Przesuń pionka
				this.player.x--;
			}
			else if (this.plansza[oldX - 2][oldZ].type == "target" && this.plansza[oldX - 2][oldZ].fig == null) {
				//	Za boxem jest target
				move = true;
				log.d("Przesun na cel");

				//	Box do przesunięcia
				box = this.objects[this.plansza[oldX - 1][oldZ].index];
				//	Zmień teksturę
				box.textureId = this.game.texturesNumbers["crate_ok"];
				//	Przesuń box
				this.plansza[oldX - 2][oldZ].fig = this.plansza[oldX - 1][oldZ];
				this.plansza[oldX - 1][oldZ] = null;

				//	kolejny box na miejscu!
				this.boxCounter--;

				//	Przesuń pionka
				this.player.x--;
			}
		}
		else if (this.plansza[oldX - 1][oldZ].type == "target" && this.plansza[oldX - 1][oldZ].fig.type == "box" && (oldX > 1)) {
			//	Mamy obok boxa na target'cie i nie jest dosunięty do samego końca
			if (this.plansza[oldX - 2][oldZ] == null) {
				//	Za boxem jest pusta przestrzeń
				log.d("Przesun tgt na puste");
				move = true;

				//	Box do przesunięcia
				box = this.objects[this.plansza[oldX - 1][oldZ].fig.index];
				//	Zmień teksturę
				box.textureId = this.game.texturesNumbers["crate"];
				//	Przesuń box
				this.plansza[oldX - 2][oldZ] = this.plansza[oldX - 1][oldZ].fig;
				this.plansza[oldX - 1][oldZ].fig = null;

				//	Box wyszedł z dobrego miejsca
				this.boxCounter++;

				//	Przesuń pionka
				this.player.x--;
			}
			else if (this.plansza[oldX - 2][oldZ].type == "target" && this.plansza[oldX - 2][oldZ].fig == null) {
				//	Za boxem jest target
				move = true;
				log.d("Przesun tgt na tgt");

				//	Box do przesunięcia
				box = this.objects[this.plansza[oldX - 1][oldZ].fig.index];
				//	Przesuń box
				this.plansza[oldX - 2][oldZ].fig = this.plansza[oldX - 1][oldZ].fig;
				this.plansza[oldX - 1][oldZ].fig = null;

				//	Przesuń pionka
				this.player.x--;
			}
		}

		if (move) {
			//	Przerysuj box
			mat4.identity(box.M);
			mat4.translate(box.M, [this.xOffset + oldX - 2, 0.5, this.zOffset - oldZ]);
		}

		//	Przerysuj pozycję grajka
		mat4.identity(this.objects[this.player.id].M);
		mat4.translate(this.objects[this.player.id].M, [this.xOffset + this.player.x, 0.5, this.zOffset - this.player.z]);

		//	Zinkrementuj wynik
		this.score++;
	}
};	/* Level.moveLeft() */


/*	Rusz pionkiem w górę	*/
Level.prototype.moveUp = function () {
	// Odświeżenie pozycji gracza
	if (this.player && this.player.z < 19) {
		var oldX = this.player.x;
		var oldZ = this.player.z;
		var move = false;
		var box;
		var src;
		var dst;

		if (this.plansza[oldX][oldZ + 1] == null || (this.plansza[oldX][oldZ + 1].type == "target" && this.plansza[oldX][oldZ + 1].fig == null )) {
			//	Puste pole - przesuń pionka
			this.player.z++;
			log.d("Puste pole");
		}
		else if (this.plansza[oldX][oldZ + 1].type == "box" && (oldZ < 18)) {
			//	Mamy boxa obok i nie jest dosunięty do samego końca
			if (this.plansza[oldX][oldZ + 2] == null) {
				//	Za boxem jest pusta przestrzeń
				log.d("Przesun");
				move = true;

				//	Box do przesunięcia
				box = this.objects[this.plansza[oldX][oldZ + 1].index];
				//	Przesuń box

				this.plansza[oldX][oldZ + 2] = this.plansza[oldX][oldZ + 1];
				this.plansza[oldX][oldZ + 1] = null;
				//	Przesuń pionka
				this.player.z++;
			}
			else if (this.plansza[oldX][oldZ + 2].type == "target" && this.plansza[oldX][oldZ + 2].fig == null) {
				//	Za boxem jest target
				move = true;
				log.d("Przesun na cel");

				//	Box do przesunięcia
				box = this.objects[this.plansza[oldX][oldZ + 1].index];
				//	Zmień teksturę
				box.textureId = this.game.texturesNumbers["crate_ok"];
				//	Przesuń box
				this.plansza[oldX][oldZ + 2].fig = this.plansza[oldX][oldZ + 1];
				this.plansza[oldX][oldZ + 1] = null;

				//	Przesuń pionka
				this.player.z++;
			}
		}
		else if (this.plansza[oldX][oldZ + 1].type == "target" && this.plansza[oldX][oldZ + 1].fig.type == "box" && (oldZ < 18)) {
			//	Mamy obok boxa na target'cie i nie jest dosunięty do samego końca
			if (this.plansza[oldX][oldZ + 2] == null) {
				//	Za boxem jest pusta przestrzeń
				log.d("Przesun tgt na puste");
				move = true;

				//	Box do przesunięcia
				box = this.objects[this.plansza[oldX][oldZ + 1].fig.index];
				//	Zmień teksturę
				box.textureId = this.game.texturesNumbers["crate"];
				//	Przesuń box
				this.plansza[oldX][oldZ + 2] = this.plansza[oldX][oldZ + 1].fig;
				this.plansza[oldX][oldZ + 1].fig = null;

				//	Przesuń pionka
				this.player.z++;
			}
			else if (this.plansza[oldX][oldZ + 2].type == "target" && this.plansza[oldX][oldZ + 2].fig == null) {
				//	Za boxem jest target
				move = true;
				log.d("Przesun tgt na tgt");

				//	Box do przesunięcia
				box = this.objects[this.plansza[oldX][oldZ + 1].fig.index];
				//	Przesuń box
				this.plansza[oldX][oldZ + 2].fig = this.plansza[oldX][oldZ + 1].fig;
				this.plansza[oldX][oldZ + 1].fig = null;

				//	Przesuń pionka
				this.player.z++;
			}
		}

		if (move) {
			//	Przerysuj box
			mat4.identity(box.M);
			mat4.translate(box.M, [this.xOffset + oldX, 0.5, this.zOffset - (oldZ + 2)]);
		}

		//	Przerysuj pozycję grajka
		mat4.identity(this.objects[this.player.id].M);
		mat4.translate(this.objects[this.player.id].M, [this.xOffset + this.player.x, 0.5, this.zOffset - this.player.z]);

		//	Zinkrementuj wynik
		this.score++;
	}
};	/* Level.moveUp() */


/*	Rusz pionkiem w prawo	*/
Level.prototype.moveRight = function () {
	// Odświeżenie pozycji gracza
	if (this.player && this.player.x < 19) {
		var oldX = this.player.x;
		var oldZ = this.player.z;
		var move = false;
		var box;
		var src;
		var dst;

		if (this.plansza[oldX + 1][oldZ] == null || (this.plansza[oldX + 1][oldZ].type == "target" && this.plansza[oldX + 1][oldZ].fig == null )) {
			//	Puste pole - przesuń pionka
			this.player.x++;
			log.d("Puste pole");
		}
		else if (this.plansza[oldX + 1][oldZ].type == "box" && (oldX < 18)) {
			//	Mamy boxa obok i nie jest dosunięty do samego końca
			if (this.plansza[oldX + 2][oldZ] == null) {
				//	Za boxem jest pusta przestrzeń
				log.d("Przesun");
				move = true;

				//	Box do przesunięcia
				box = this.objects[this.plansza[oldX + 1][oldZ].index];
				//	Przesuń box

				this.plansza[oldX + 2][oldZ] = this.plansza[oldX + 1][oldZ];
				this.plansza[oldX + 1][oldZ] = null;
				//	Przesuń pionka
				this.player.x++;
			}
			else if (this.plansza[oldX + 2][oldZ].type == "target" && this.plansza[oldX + 2][oldZ].fig == null) {
				//	Za boxem jest target
				move = true;
				log.d("Przesun na cel");

				//	Box do przesunięcia
				box = this.objects[this.plansza[oldX + 1][oldZ].index];
				//	Zmień teksturę
				box.textureId = this.game.texturesNumbers["crate_ok"];
				//	Przesuń box
				this.plansza[oldX + 2][oldZ].fig = this.plansza[oldX + 1][oldZ];
				this.plansza[oldX + 1][oldZ] = null;

				//	Przesuń pionka
				this.player.x++;
			}
		}
		else if (this.plansza[oldX + 1][oldZ].type == "target" && this.plansza[oldX + 1][oldZ].fig.type == "box" && (oldX < 18)) {
			//	Mamy obok boxa na target'cie i nie jest dosunięty do samego końca
			if (this.plansza[oldX + 2][oldZ] == null) {
				//	Za boxem jest pusta przestrzeń
				log.d("Przesun tgt na puste");
				move = true;

				//	Box do przesunięcia
				box = this.objects[this.plansza[oldX + 1][oldZ].fig.index];
				//	Zmień teksturę
				box.textureId = this.game.texturesNumbers["crate"];
				//	Przesuń box
				this.plansza[oldX + 2][oldZ] = this.plansza[oldX + 1][oldZ].fig;
				this.plansza[oldX + 1][oldZ].fig = null;

				//	Przesuń pionka
				this.player.x++;
			}
			else if (this.plansza[oldX + 2][oldZ].type == "target" && this.plansza[oldX + 2][oldZ].fig == null) {
				//	Za boxem jest target
				move = true;
				log.d("Przesun tgt na tgt");

				//	Box do przesunięcia
				box = this.objects[this.plansza[oldX + 1][oldZ].fig.index];
				//	Przesuń box
				this.plansza[oldX + 2][oldZ].fig = this.plansza[oldX + 1][oldZ].fig;
				this.plansza[oldX + 1][oldZ].fig = null;

				//	Przesuń pionka
				this.player.x++;
			}
		}

		if (move) {
			//	Przerysuj box
			mat4.identity(box.M);
			mat4.translate(box.M, [this.xOffset + oldX + 2, 0.5, this.zOffset - oldZ]);
		}

		//	Przerysuj pozycję grajka
		mat4.identity(this.objects[this.player.id].M);
		mat4.translate(this.objects[this.player.id].M, [this.xOffset + this.player.x, 0.5, this.zOffset - this.player.z]);

		//	Zinkrementuj wynik
		this.score++;
	}
};	/* Level.moveRight() */


/*	Rusz pionkiem w dół	*/
Level.prototype.moveDown = function () {
	// Odświeżenie pozycji gracza
	if (this.player && this.player.z > 0) {
		var oldX = this.player.x;
		var oldZ = this.player.z;
		var move = false;
		var box;
		var src;
		var dst;

		if (this.plansza[oldX][oldZ - 1] == null || (this.plansza[oldX][oldZ - 1].type == "target" && this.plansza[oldX][oldZ - 1].fig == null )) {
			//	Puste pole - przesuń pionka
			this.player.z--;
			log.d("Puste pole");
		}
		else if (this.plansza[oldX][oldZ - 1].type == "box" && (oldZ > 1)) {
			//	Mamy boxa obok i nie jest dosunięty do samego końca
			if (this.plansza[oldX][oldZ - 2] == null) {
				//	Za boxem jest pusta przestrzeń
				log.d("Przesun");
				move = true;

				//	Box do przesunięcia
				box = this.objects[this.plansza[oldX][oldZ - 1].index];
				//	Przesuń box

				this.plansza[oldX][oldZ - 2] = this.plansza[oldX][oldZ - 1];
				this.plansza[oldX][oldZ - 1] = null;
				//	Przesuń pionka
				this.player.z--;
			}
			else if (this.plansza[oldX][oldZ - 2].type == "target" && this.plansza[oldX][oldZ - 2].fig == null) {
				//	Za boxem jest target
				move = true;
				log.d("Przesun na cel");

				//	Box do przesunięcia
				box = this.objects[this.plansza[oldX][oldZ - 1].index];
				//	Zmień teksturę
				box.textureId = this.game.texturesNumbers["crate_ok"];
				//	Przesuń box
				this.plansza[oldX][oldZ - 2].fig = this.plansza[oldX][oldZ - 1];
				this.plansza[oldX][oldZ - 1] = null;

				//	Przesuń pionka
				this.player.z--;
			}
		}
		else if (this.plansza[oldX][oldZ - 1].type == "target" && this.plansza[oldX][oldZ - 1].fig.type == "box" && (oldZ > 1)) {
			//	Mamy obok boxa na target'cie i nie jest dosunięty do samego końca
			if (this.plansza[oldX][oldZ - 2] == null) {
				//	Za boxem jest pusta przestrzeń
				log.d("Przesun tgt na puste");
				move = true;

				//	Box do przesunięcia
				box = this.objects[this.plansza[oldX][oldZ - 1].fig.index];
				//	Zmień teksturę
				box.textureId = this.game.texturesNumbers["crate"];
				//	Przesuń box
				this.plansza[oldX][oldZ - 2] = this.plansza[oldX][oldZ - 1].fig;
				this.plansza[oldX][oldZ - 1].fig = null;

				//	Przesuń pionka
				this.player.z--;
			}
			else if (this.plansza[oldX][oldZ - 2].type == "target" && this.plansza[oldX][oldZ - 2].fig == null) {
				//	Za boxem jest target
				move = true;
				log.d("Przesun tgt na tgt");

				//	Box do przesunięcia
				box = this.objects[this.plansza[oldX][oldZ - 1].fig.index];
				//	Przesuń box
				this.plansza[oldX][oldZ - 2].fig = this.plansza[oldX][oldZ - 1].fig;
				this.plansza[oldX][oldZ - 1].fig = null;

				//	Przesuń pionka
				this.player.z--;
			}
		}

		if (move) {
			//	Przerysuj box
			mat4.identity(box.M);
			mat4.translate(box.M, [this.xOffset + oldX, 0.5, this.zOffset - (oldZ - 2)]);
		}

		//	Przerysuj pozycję grajka
		mat4.identity(this.objects[this.player.id].M);
		mat4.translate(this.objects[this.player.id].M, [this.xOffset + this.player.x, 0.5, this.zOffset - this.player.z]);

		//	Zinkrementuj wynik
		this.score++;
	}
};	/* Level.moveDown() */


/*	Level.pause()	*/
Level.prototype.pause = function () {
	log.i("Pausa!");
	this.totalTime += new Date().getTime() - this.startTime;
	this.paused = true;
	this.game.lastState = this;
	this.game.scene = new Menu(this.game);
	this.game.scene.run();
};	/*	Level.pause()	*/


/*	Level.finish()	*/
Level.prototype.finish = function () {
	log.d("Skończ waść wstydu oszczędź.");
	this.totalTime += new Date().getTime() - this.startTime;
	this.paused = true;
	this.game.finishLevel();
};	/*	Level.finish()	*/
