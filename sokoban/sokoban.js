/*
 *	author: Warej & Radek
 *	state: 	TODO
 *
 *	Główna klasa gry
 *
 */


/*	Konstruktor klasy gry	*/
function Sokoban () {
	//	Zaczynamy od poziomu zerowego
	this.levelNo = 0;

	//	Na początku sumaryczny czas i wynik jest zerowy
	this.sumTime = 0;
	this.sumScore = 0;

	//	To że się wywołał konstruktor, to nie oznacza jeszcze, że już działa
	this.running = false;

	//	Gra się zaczyna, a nie kończy :)
	this.finished = false;

	//	Na razie nie ma załadowanego żadnego modelu
	this.models = {};

	//	Na razie nie ma żadnej tekstury
	this.textures = {};
	this.texturesNumbers = {};

	//	Załaduj se co trzeba
	this.load();
};	/*		Sokoban()	*/


/*	Sokoban.load()	*/
Sokoban.prototype.load = function () {
	/*  Inicjalizacja gry - załadowanie shaderów, obiektów, tekstur itp
	 *  Tutaj sterowanie się rozdwaja: w jednym wątku idzie pobieranie plików, a w drugim rusza odświeżanie
	 */
	log.d("Inicjalizacja gry.");
	init(this);
};	/*	Sokoban.load()	*/


/*	Funkcja startująca całość i wywołująca menu	*/
Sokoban.prototype.start = function () {
	//	Funkcja ładująca wszystkie elementy sceny
	log.i("Ładowanie gry.");
	//this.load();	//	Docelowo

	// Załadowanie menu
	log.i("Ładuję menu.");
	this.scene = new Menu(this);
	this.scene.run();

    // Po załadowaniu znika ekran ładowania gry
    $("#loadingPage").fadeOut(300);

    //	Zmiana zmiennej start, żeby zaczęły działać f-cje animate(), draw() i ;przechwytywanie klawiszy.
    //	De facto start menu :)
	this.running = true;
};	/*	Sokoban.start()	*/


/*	Funkcja rysująca zawartość gry	*/
Sokoban.prototype.draw = function () {
	//	Czyszczenie ekranu
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//	Ładowanie zmiennych jednorodnych
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

	//	Ładowanie tekstur do buforów
	this.texturesNumbers["grass"] = 0;
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.textures["grass"]);

	this.texturesNumbers["brick"] = 1;
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, this.textures["brick"]);



	//	Rysowanie obecnej sceny
	this.scene.draw();

	//	W menu nie wypisujemy czasu, ani wyniku chyba, że to jest pauza
	//if (this.scene instanceof Level) {
		this.drawTime();
		this.drawScore();
	//}
};	/*	Sokoban.draw()	*/


/*	Bardzo poruszająca funkcja godna Kopernika	*/
Sokoban.prototype.animate = function () {
	if (this.scene) {
		this.scene.animate();
	}
}	/*	Sokoban.animate()	*/

Sokoban.prototype.drawScore = function () {

};

Sokoban.prototype.drawTime = function () {

};


/*	Metoda rysująca dany obiekty	*/
Sokoban.prototype.drawModel = function (model) {
	if (!model) {
		log.e("Podany model nie istnieje!");
		return null;
	}

	//	Tmp - przypisanie numeru tekstury
	gl.uniform1i(shaderProgram.colorMapSamplerUniform, this.texturesNumbers["brick"]);

	//	Ładowanie pozycji wierzchołków
	if (model.vPosition) {
		gl.bindBuffer(gl.ARRAY_BUFFER, model.vPosition);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, model.vPosition.itemSize, gl.FLOAT, false, 0, 0);
	}

	//	Ładowanie współrzędnych teksturowania
	if (model.vTextureCoords) {
		gl.bindBuffer(gl.ARRAY_BUFFER, model.vTextureCoords);
		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, model.vTextureCoords.itemSize, gl.FLOAT, false, 0, 0);
	}

	//	Ładowanie wektorów normalnych
	if (model.vNormal) {
		gl.bindBuffer(gl.ARRAY_BUFFER, model.vNormal);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, model.vNormal.itemSize, gl.FLOAT, false, 0, 0);
	}

	//	Ładowanie indeksów
	if (model.vIndex) {
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.vIndex);
	}

	//	Przesyłanie buforów
	setMatrixUniforms();

	//	Rysowanie!
	if (model.vIndex) {
		gl.drawElements(gl.TRIANGLES, model.vIndex.numItems, gl.UNSIGNED_SHORT, 0);
	}
	else if (model.vPosition) {
		gl.drawArrays(gl.TRIANGLES, 0, model.vPosition.numItems);
	}
	else {
		log.e("Nie ma modelu do narysowania " + model.name);
	}
};	/* Sokoban.drawModel()	*/


/*	Funkcja ładująca model JSONowy	*/
Sokoban.prototype.loadJSON = function (name) {
	var model = {};
	model.vPosition = null;
	model.vTextureCoords = null;
	model.vNormal = null;
	model.vIndex = null;
	model.name = name;
	model.M = null;

	//	Z jakiegoś powodu to mi nie działa ;/

	//	Macierz modelu jest indywidualna dla każdego obiektu
	//mat4.identity(model.M);

	var request = new XMLHttpRequest();
	var path = "models/" + name + ".json";
	log.d("Loading file " + path);
	request.open("GET", path);
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

	this.models[name] = model;
};	/*	Sokoban.loadJSON()	*/


/*	Funkcja ładująca model tekstowy	*/
Sokoban.prototype.loadTXT = function (name) {
	var model = {};
	model.vPosition = null;
	model.vTextureCoords = null;
	model.vNormal = null;
	model.vIndex = null;
	model.name = name;
	model.M = null;

	//	Z jakiegoś powodu to mi nie działa ;/

	//	Macierz modelu jest indywidualna dla każdego obiektu
	//mat4.identity(model.M);

	var request = new XMLHttpRequest();
	var path = "models/" + name + ".txt";
	log.d("Loading file " + path);
	request.open("GET", path);
	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			var result_temp = handleLoadedModelTXT(request.responseText);
			model.vPosition = result_temp.vPosition;
			model.vTextureCoords = result_temp.vTextureCoords;
			model.vNormal = result_temp.vNormal;
			model.vIndex = result_temp.vIndex;
		}
	}
	request.send();

	this.models[name] = model;
};	/*	Sokoban.loadTXT()	*/


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
