
/*
 *
 *	author: Warej & Radek
 *	state: Almost done - only 90% remains :)
 *
 */

/*	Funkcja inicjująca grę	*/
function init(game) {
	//	Inicjalizacja WebGLa
	initGL(document.getElementById("canvas"));

	//	Inicjalizacja shaderów
	initShaders();

	//	Stworzenie pobieracza
	dwnldr = new Downloader(game.start /* callback function */);

	//	Dodanie obiektów do kolejki pobierania
	addObjects2Download(game, dwnldr);

	//	Zapuszczenie ładowania obrazków i tworzenia tekstur
	initTextures();

	//	Czyszczenie ekranu
	gl.clearColor(0.0, 0.4, 0.4, 1.0);
	gl.enable(gl.DEPTH_TEST);

	//	Rozpoczęcie pobierania (asynchroniczne!!!)
	dwnldr.start();
	//	Po zakończeniu pobierania wywołana zostanie
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
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
	
	shaderProgram.colorMapSamplerUniform = gl.getUniformLocation(shaderProgram, "uColorMapSampler");
	shaderProgram.specularMapSamplerUniform = gl.getUniformLocation(shaderProgram, "uSpecularMapSampler");
	shaderProgram.useColorMapUniform = gl.getUniformLocation(shaderProgram, "uUseColorMap");
	shaderProgram.useSpecularMapUniform = gl.getUniformLocation(shaderProgram, "uUseSpecularMap");
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
function loadImg (name) {
	tex = gl.createTexture();
	tex.image = new Image();
	tex.image.onload = function () {
		handleLoadedTexture(tex);
	};
	tex.image.src = "./" + name + ".png";
	return tex;
}	/*	loadImg()	*/


/*	Funkcja inicjująca wszystkie(!) tekstury	*/
function initTextures(imageList) {
	//	TODO Trzeba będzie tutaj dopisać wszystkie obrazki
	var textures = new Object();

	// Załaduj przykładowy obrazek
	//textures["example"] = loadImg("example");

	return textures;
}	/*	initTexture()	*/

