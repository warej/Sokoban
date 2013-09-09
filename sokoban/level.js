
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


/*	Level()	*/
function Level (gra, nr) {
	this.number = nr;
	this.totalTime = 0;
	this.paused = false;
	this.game = gra;
};	/*	Level()	*/


/*	Level.load()	*/
Level.prototype.load = function (no) {
};	/*	Level.load()	*/


/*	Level.draw()	*/
Level.prototype.draw = function () {

};	/*	Level.draw()	*/


/*	Level.run()	*/
Level.prototype.run = function () {
	log.d("Startuję poziom " + this.number);
	this.startTime = new Date().getTime();
	loadWorld();    //  Testowo
};  /*	Level.roun()	*/


/*	Level.handleKeys()	*/
Level.prototype.handleKeys = function(first_argument) {
	//	Ruch kamerą: C + klawisze sterujące
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


	var result = {};
	result[0] = tempVertexPositionBuffer;
	result[1] = tempVertexTextureCoordBuffer;
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
	result[0] = tempVertexPositionBuffer;
	result[1] = tempVertexTextureCoordBuffer;
	result[2] = tempVertexNormalBuffer;
	result[3] = tempVertexIndexBuffer;
	return result;
}   /*  handleLoadedModelJSON(data) */

/* Funkcja ładująca wszystkie elementy sceny */
function loadWorld() {
	loadFloor();
	loadWalls();
	loadPlayer();

	loadTeapot();
}   /*  loadWorld() */




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



