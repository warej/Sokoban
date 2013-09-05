
/*
 *
 *	author: Warej & Radek
 *	state: Almost done - only 90% remains :)
 *
 */

/*	Funkcja inicjująca grę	*/
function init(game) {
	//	Inicjalizacja WebGLa
	initGL(document.getElementById("main_canvas"));

	//	Inicjalizacja shaderów
	initShaders();

	//	Stworzenie pobieracza
	dwnldr = new Downloader(game.start /* callback function */);

	//	Dodanie obiektów do kolejki pobierania
	addObjects2Download(game, dwnldr);

	//	Zapuszczenie ładowania obrazków i tworzenia tekstur
	initTextures();
	
	//	Funkcja ładująca wszystkie elementy sceny
	loadWorld();

	//	Czyszczenie ekranu
	gl.clearColor(0.35, 0.35, 0.4, 1.0);
	gl.enable(gl.DEPTH_TEST);

	//	Rozpoczęcie pobierania (asynchroniczne!!!)
	dwnldr.start();
	//	Po zakończeniu pobierania wywołana zostanie
	
	// Przechwytuj obsługę klawiszy
	document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
} /*  init()  */


/*	Funkcja dodająca objekty do listy pobierania	*/
function addObjects2Download (game, dwnldr) {
	/*	example, TODO dodać obiekty do pobrania *
	dwnldr.newFile('./obj/crate.json', function (response) {
		game.crate = JSON.parse(response);
	});
	/*		*/
}	/*	addObjects2Download()	*/


/*	Inicjalizacja WebGLa	*/
function initGL(canvas) {
	try {
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch (e) {
	}
	if (!gl) {
		alert("Failed to load WebGL :(");
	}
}	/*	initGl()	*/


/*	Pobranie shaderów	*/
function getShader(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}

	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}

	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}	/*	getShader()	*/


/*	Iniclializacja shaderów	*/
function initShaders() {
	/*	TODO No i tutaj będzie jazda, żeby te shadery ładnie napisać :)
	 */

	var fragmentShader = getShader(gl, "fshader");
	var vertexShader = getShader(gl, "vshader");

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}

	gl.useProgram(shaderProgram);

	// do VS:
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
	gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

	shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
	gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);


	// do VS i FS:
	shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uM");
	shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uV");
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uP");
	shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uN");
	
	shaderProgram.colorMapSamplerUniform = gl.getUniformLocation(shaderProgram, "uColorMapSampler");
		//shaderProgram.specularMapSamplerUniform = gl.getUniformLocation(shaderProgram, "uSpecularMapSampler");	// oddzielna tekstura dla odbijania światła
	shaderProgram.useColorMapUniform = gl.getUniformLocation(shaderProgram, "uUseColorMap");	// decyduje, czy używać tekstur
		//shaderProgram.useSpecularMapUniform = gl.getUniformLocation(shaderProgram, "uUseSpecularMap");
	shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
	shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
	shaderProgram.pointLightingLocationUniform = gl.getUniformLocation(shaderProgram, "uPointLightingLocation");
	shaderProgram.pointLightingSpecularColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingSpecularColor");
	shaderProgram.pointLightingDiffuseColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingDiffuseColor");
}	/*	initShaders()	*/


/*	Funkcja ładująca pobraną texturę	*/
function handleLoadedTexture(texture) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);

        gl.bindTexture(gl.TEXTURE_2D, null);
}	/*	handleLoadedTexture()	*/


/*	Funkcja ładująca obrazek do tekstury	*/
function loadImg (name, tex) {
	tex.image = new Image();
	tex.image.onload = function () {
		handleLoadedTexture(tex);
	};
	tex.image.src = "./" + name;
	return tex;
}	/*	loadImg()	*/


/*	Funkcja inicjująca wszystkie(!) tekstury	*/
function initTextures() {

	tex1 = gl.createTexture();
	textures["brick"] = loadImg("brick.gif", tex1);
	
	tex2 = gl.createTexture();
	textures["grass"] = loadImg("trawa3.gif", tex2);

}	/*	initTexture()	*/



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