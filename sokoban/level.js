
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
	loadWalls();
	loadPlayer();

	loadTeapot();
	this.loadJSON("sword");
};	/*	Level.load()	*/


/*	Level.draw()	*/
Level.prototype.draw = function () {
	//	Czyszczenie ekranu
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//	RADKOWE =========================================
	//	=================================================

	if (floorVertexTextureCoordBuffer == null || floorVertexPositionBuffer == null	||
		wallsVertexTextureCoordBuffer == null || wallsVertexPositionBuffer == null) {
		return null;
	}


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
	gl.uniform1i(shaderProgram.colorMapSamplerUniform, textures_numbers["grass"]);

	gl.bindBuffer(gl.ARRAY_BUFFER, floorVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, floorVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, floorVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, floorVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 0, floorVertexPositionBuffer.numItems);

	// WALLS
	gl.uniform1i(shaderProgram.colorMapSamplerUniform, textures_numbers["brick"]);

	gl.bindBuffer(gl.ARRAY_BUFFER, wallsVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, wallsVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, wallsVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, wallsVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 0, wallsVertexPositionBuffer.numItems);


	//vStackPush();

	// PLAYER
	mat4.identity(M);
	mat4.translate(M, [-xPlayer, 0.0, zPlayer]);

	gl.uniform1i(shaderProgram.colorMapSamplerUniform, textures_numbers["brick"]);

	gl.bindBuffer(gl.ARRAY_BUFFER, playerVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, playerVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, playerVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, playerVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 0, playerVertexPositionBuffer.numItems);

	//vStackPop();

	//	Tu dalej jest rysowanie mieczyków w wersji uproszczonej :)

	//	Test 1 - wareja
	mat4.identity(M);
	mat4.translate(M, [0.0, 3.0, 0.0]);
	var model = this.objects["sword"];
	model.M = M;
	this.drawModel(model);

	//	Test 2 - wareja
	mat4.identity(M);
	mat4.translate(M, [0.0, 6.0, 0.0]);
	var model = this.objects["sword"];
	model.M = M;
	this.drawModel(model);

	//	Test 3 - wareja
	mat4.identity(M);
	mat4.translate(M, [0.0, 9.0, 0.0]);
	var model = this.objects["sword"];
	model.M = M;
	this.drawModel(model);
};	/*	Level.draw()	*/


/*	Metoda rysująca dany obiekty	*/
Level.prototype.drawModel = function (model) {
	if (!model) {
		log.e("Podany model nie istnieje!");
		return null;
	}

	//	Na to na razie nie mam pomysłu
	var textures_numbers = {};

	textures_numbers["grass"] = 0;
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textures["grass"]);

	textures_numbers["brick"] = 1;
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, textures["brick"]);
	//	Dotąd jest do przerobienia


	gl.uniform1i(shaderProgram.colorMapSamplerUniform, textures_numbers["grass"]);

	//	Ładowanie pozycji wierzchołków
	gl.bindBuffer(gl.ARRAY_BUFFER, model.vPosition);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, model.vPosition.itemSize, gl.FLOAT, false, 0, 0);

	//	Ładowanie współrzędnych teksturowania
	gl.bindBuffer(gl.ARRAY_BUFFER, model.vTextureCoords);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, model.vTextureCoords.itemSize, gl.FLOAT, false, 0, 0);

	//	Ładowanie wektorów normalnych
	gl.bindBuffer(gl.ARRAY_BUFFER, model.vNormal);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, model.vNormal.itemSize, gl.FLOAT, false, 0, 0);

	//	Ładowanie indeksów
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.vIndex);

	//	Przesyłanie buforów
	setMatrixUniforms();

	//	Rysowanie!
	gl.drawElements(gl.TRIANGLES, model.vIndex.numItems, gl.UNSIGNED_SHORT, 0);
};	/* Level.drawModel()	*/


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


/*	Funkcja ładująca mieczyk	*/
Level.prototype.loadJSON = function (name) {
	var model = {};
	model.vPosition = null;
	model.vTextureCoords = null;
	model.vNormal = null;
	model.vIndex = null;
	model.M = null;

	//	Z jakiegoś powodu to mi nie działa ;/

	//	Macierz modelu jest indywidualna dla każdego obiektu
	//mat4.identity(model.M);

	var request = new XMLHttpRequest();
	request.open("GET", "models/" + name + ".json");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			var result_temp = handleLoadedModelJSON(JSON.parse(request.responseText));
			model.vPosition = result_temp.vPosition;
			model.vTextureCoords = result_temp.vTextureCoords;
			model.vNormal = result_temp.vNormal;
			model.vIndex = result_temp.vIndex;
		}
	}
	request.send();

	this.objects[name] = model;
};	/*	Level.loadJSON()	*/




/* Funkcja odcztyująca modele z plików txt */
function handleLoadedModelTXT(data) {
	var tempVertexPositionBuffer = null;
	var tempVertexTextureCoordBuffer = null;

	var lines = data.split("\n");
	var vertexCount = 0;
	var vertexPositions = [];
	var vertexTextureCoords = [];
	for (var i in lines) {
		var vals = lines[i].replace(/^\s+/, "").split(/\s+/);
		if (vals.length == 5 && vals[0] != "//") {
			// It is a line describing a vertex; get X, Y and Z first
			vertexPositions.push(parseFloat(vals[0]));
			vertexPositions.push(parseFloat(vals[1]));
			vertexPositions.push(parseFloat(vals[2]));

			// And then the texture coords
			vertexTextureCoords.push(parseFloat(vals[3]));
			vertexTextureCoords.push(parseFloat(vals[4]));

			vertexCount += 1;
		}
	}

	tempVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, tempVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW);
	tempVertexPositionBuffer.itemSize = 3;
	tempVertexPositionBuffer.numItems = vertexCount;

	tempVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, tempVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexTextureCoords), gl.STATIC_DRAW);
	tempVertexTextureCoordBuffer.itemSize = 2;
	tempVertexTextureCoordBuffer.numItems = vertexCount;

	//	Stare
	var result = {};
	result[0] = tempVertexPositionBuffer;
	result[1] = tempVertexTextureCoordBuffer;

	//	Docelowo
	result["vPosition"] = tempVertexPositionBuffer;
	result["vTextureCoords"] = tempVertexTextureCoordBuffer;

	return result;
}   /*  handleLoadedModelTXT(data)  */


/* Funkcja odczytująca modele z plików JSON */
function handleLoadedModelJSON(data) {
	var tempVertexNormalBuffer = null;
	var tempVertexTextureCoordBuffer = null;
	var tempVertexPositionBuffer = null;
	var tempVertexIndexBuffer = null;

	tempVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, tempVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.vertexNormals), gl.STATIC_DRAW);
	tempVertexNormalBuffer.itemSize = 3;
	tempVertexNormalBuffer.numItems = data.vertexNormals.length / 3;


	tempVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, tempVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.vertexTextureCoords), gl.STATIC_DRAW);
	tempVertexTextureCoordBuffer.itemSize = 2;
	tempVertexTextureCoordBuffer.numItems = data.vertexTextureCoords.length / 2;

	tempVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, tempVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.vertexPositions), gl.STATIC_DRAW);
	tempVertexPositionBuffer.itemSize = 3;
	tempVertexPositionBuffer.numItems = data.vertexPositions.length / 3;

	tempVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tempVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), gl.STATIC_DRAW);
	tempVertexIndexBuffer.itemSize = 1;
	tempVertexIndexBuffer.numItems = data.indices.length;


	var result = {};
	//	Stare
	result[0] = tempVertexPositionBuffer;
	result[1] = tempVertexTextureCoordBuffer;
	result[2] = tempVertexNormalBuffer;
	result[3] = tempVertexIndexBuffer;

	//	Docelowe
	result["vPosition"] = tempVertexPositionBuffer;
	result["vTextureCoords"] = tempVertexTextureCoordBuffer;
	result["vNormal"] = tempVertexNormalBuffer;
	result["vIndex"] = tempVertexIndexBuffer;
	return result;
}   /*  handleLoadedModelJSON(data) */


var teapotVertexPositionBuffer = null;
var teapotVertexNormalBuffer = null;
var teapotVertexTextureCoordBuffer = null;
var teapotVertexIndexBuffer = null;

function loadTeapot() {
	var request = new XMLHttpRequest();
	request.open("GET", "models/sword.json");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			var result_temp = handleLoadedModelJSON(JSON.parse(request.responseText));
			teapotVertexPositionBuffer = result_temp[0];
			teapotVertexTextureCoordBuffer = result_temp[1];
			teapotVertexNormalBuffer = result_temp[2];
			teapotVertexIndexBuffer = result_temp[3];
		}
	}
	request.send();
}



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


// WALLS:
var wallsVertexPositionBuffer = null;
var wallsVertexTextureCoordBuffer = null;

function loadWalls() {
	var request = new XMLHttpRequest();
	request.open("GET", "models/walls.txt");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			 var result_temp = handleLoadedModelTXT(request.responseText);
			 wallsVertexPositionBuffer = result_temp[0];
			 wallsVertexTextureCoordBuffer = result_temp[1];
		}
	}
	request.send();
}   /*  loadWalls() */

// PLAYER:
var playerVertexPositionBuffer = null;
var playerVertexTextureCoordBuffer = null;

function loadPlayer() {
	var request = new XMLHttpRequest();
	request.open("GET", "models/player.txt");
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			 var result_temp = handleLoadedModelTXT(request.responseText);
			 playerVertexPositionBuffer = result_temp[0];
			 playerVertexTextureCoordBuffer = result_temp[1];
		}
	}
	request.send();
}   /*  loadPlayer()    */



