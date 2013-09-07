/*
 *	author: Warej & Radek
 *	state: 	TODO
 *
 *	Główna klasa gry
 *
 */



// Artur => Radek: Wiesz jak ja lubię globalki, nie? ;p

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



function Sokoban () {
	//	Zaczynamy od poziomu zerowego
	this.levelNo = 0;
	this.startTime = 0;
	this.running = false;
};	/*		Sokoban()	*/

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
}	/*	handleLoadedModelTXT(data)	*/



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
}	/*	handleLoadedModelJSON(data)	*/

/* Funkcja ładująca wszystkie elementy sceny */
function loadWorld() {
	// Przechwytuj obsługę klawiszy
	log.d("Ładowanie obsługi klawiszy");
	document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

	loadFloor();
	loadWalls();
	loadPlayer();

	loadTeapot();
}	/*	loadWorld()	*/




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
}	/*	loadFloor()	*/


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
}	/*	loadWalls()	*/

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
}	/*	loadPlayer()	*/




Sokoban.prototype.load = function () {
};

/*	Funkcja rozpoczynająca nową grę (wywoływana z menu)
 */
Sokoban.prototype.newGame = function () {
	// Zapisanie czasu startu
	this.startTime = new Date().getTime();

};

/*	Funkcja startująca całość i wywołująca menu
 */
Sokoban.prototype.start = function () {
	//	Funkcja ładująca wszystkie elementy sceny
	log.i("Ładowanie gry.");
	//this.load();	//	Docelowo

	// Załadowanie menu
	log.i("Ładuję menu.");
	this.scene = new Menu(this);

    // Po załadowaniu znika ekran ładowania gry
    $("#loadingPage").fadeOut(300);

    // Zmiana zmiennej start, żeby zaczęły działać f-cje animate() i draw()
	log.i("Start gry!");
	this.running = true;

	loadWorld();	//	Testowo

	// this.scene.run();	//	Docelowo
};

Sokoban.prototype.draw = function () {
	//document.getElementById("konsola1").textContent = "Sokoban draw działa";

	drawScene();

	this.drawTime();
	this.drawScore();
};

Sokoban.prototype.animate = function () {
	//document.getElementById("konsola2").textContent = "Sokoban animate działa ";

	animate();

	return null;
}

Sokoban.prototype.drawScore = function () {

};

Sokoban.prototype.drawTime = function () {

};