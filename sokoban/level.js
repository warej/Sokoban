
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
	mat4.perspective(55, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, P);
	mat4.identity(V);

	//	Załadowanie obiektów
	this.objects = {};
	this.load();
};	/*	Level()	*/


/*	Funkcja ładująca wszystkie potrzebne obiekty	*/
Level.prototype.load = function () {
	loadFloor();

	this.game.loadTXT("floor");
	this.game.loadTXT("walls");
	this.game.loadTXT("player");

	this.game.loadJSON("sword");
};	/*	Level.load()	*/


/*	Level.draw()	*/
Level.prototype.draw = function () {
	//	Czyszczenie ekranu
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//	RADKOWE =========================================
	//	=================================================
/*
	if (floorVertexTextureCoordBuffer == null || floorVertexPositionBuffer == null	||
		wallsVertexTextureCoordBuffer == null || wallsVertexPositionBuffer == null) {
		return null;
	}	*/


	var useColorMap = document.getElementById("color-map").checked;
    gl.uniform1i(shaderProgram.useColorMapUniform, useColorMap);

	var lighting = document.getElementById("lighting").checked;
	gl.uniform1i(shaderProgram.useLightingUniform, lighting);
	if (lighting) {
		gl.uniform3f(
			shaderProgram.ambientColorUniform,
			parseFloat(document.getElementById("ambientR").value),
			parseFloat(document.getElementById("ambientG").value),
			parseFloat(document.getElementById("ambientB").value)
		);

		gl.uniform3f(
			shaderProgram.pointLightingLocationUniform,
			parseFloat(document.getElementById("lightPositionX").value),
			parseFloat(document.getElementById("lightPositionY").value),
			parseFloat(document.getElementById("lightPositionZ").value)
		);

		gl.uniform3f(
			shaderProgram.pointLightingSpecularColorUniform,
			parseFloat(document.getElementById("specularR").value),
			parseFloat(document.getElementById("specularG").value),
			parseFloat(document.getElementById("specularB").value)
		);

		gl.uniform3f(
			shaderProgram.pointLightingDiffuseColorUniform,
			parseFloat(document.getElementById("diffuseR").value),
			parseFloat(document.getElementById("diffuseG").value),
			parseFloat(document.getElementById("diffuseB").value)
		);
	}


	mat4.perspective(55, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, P);


	mat4.identity(M);
	mat4.identity(V);

	mat4.rotate(V, degToRad(-pitch), [1, 0, 0]);
	mat4.rotate(V, degToRad(-yaw), [0, 1, 0]);
	mat4.translate(V, [-xPos, -yPos, -zPos]);

	var textures_numbers = {};

	textures_numbers["grass"] = 0;
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textures["grass"]);

	textures_numbers["brick"] = 1;
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, textures["brick"]);


	// FLOOR:
	var model = this.game.models["floor"];
	//model.M = M;
	this.game.drawModel(model);


	// WALLS

	var model = this.game.models["walls"];
	//model.M = M;
	this.game.drawModel(model);

	//vStackPush();

	// PLAYER
	mat4.identity(M);
	mat4.translate(M, [-xPlayer, 0.0, zPlayer]);

	var model = this.game.models["player"];
	//model.M = M;
	this.game.drawModel(model);

	//vStackPop();

	//	Tu dalej jest rysowanie mieczyków w wersji uproszczonej :)

	//	Test 1 - wareja
	mat4.identity(M);
	mat4.translate(M, [0.0, 3.0, 0.0]);
	var model = this.game.models["sword"];
	//model.M = M;
	this.game.drawModel(model);

	//	Test 2 - wareja
	mat4.identity(M);
	mat4.translate(M, [0.0, 6.0, 0.0]);
	var model = this.game.models["sword"];
	//model.M = M;
	this.game.drawModel(model);

	//	Test 3 - wareja
	mat4.identity(M);
	mat4.translate(M, [0.0, 9.0, 0.0]);
	var model = this.game.models["sword"];
	//model.M = M;
	this.game.drawModel(model);
};	/*	Level.draw()	*/


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
	if (currentlyPressedKeys[67]) {
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
			speedPlayerZ = 0.01;
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


/*	Level.pause()	*/
Level.prototype.pause = function () {
	log.i("Pausa!");
	this.totalTime += new Date().getTime() - this.startTime;
	this.paused = true;
	this.game.lastState = this;
	this.game.scene = new Menu(this.game);
	this.game.scene.run();
};	/*	Level.pause()	*/


// FLOOR:
var floorVertexPositionBuffer = null;
var floorVertexTextureCoordBuffer = null;

function loadFloor() {
	var request = new XMLHttpRequest();
	request.open("GET", "models/floor.txt");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			 var result_temp = handleLoadedModelTXT(request.responseText);
			 floorVertexPositionBuffer = result_temp[0];
			 floorVertexTextureCoordBuffer = result_temp[1];
		}
	}
	request.send();
}   /*  loadFloor() */




