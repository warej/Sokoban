
/*
 *
 *	author: Warej & Radek
 *	state: Almost done - only 90% remains :)
 *
 */

/*	Funkcja inicjująca grę	*/
function init(gra) {
	//	Inicjalizacja WebGLa
	log.i("Ładuję WebGLa.");
	initGL(document.getElementById("main_canvas"));

	//	Inicjalizacja shaderów
	log.i("Ładuję shadery.");
	initShaders();

	//	Stworzenie pobieracza
	dwnldr = new Downloader(gra.start /* callback function */, gra /* context */);

	//	Dodanie obiektów do kolejki pobierania
	log.d("Dodawanie plików do kolejki pobierania.");
	addObjects2Download(gra, dwnldr);

	//	Zapuszczenie ładowania obrazków i tworzenia tekstur
	log.i("Ładuję tekstury.");
	initTextures(gra);

	//	Czyszczenie ekranu
	log.d("Czyszczenie ekranu.");
	gl.clearColor(0.35, 0.35, 0.4, 1.0);
	gl.enable(gl.DEPTH_TEST);

    // Obsługa klawiszy
    log.d("Ładowanie obsługi klawiszy");
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

	//	Rozpoczęcie pobierania (asynchroniczne!!!)
	dwnldr.start();
	//	Po zakończeniu pobierania wywołana zostanie metoda game.start().
} /*  init()  */


/*	Funkcja dodająca objekty do listy pobierania	*/
function addObjects2Download (game, dwnldr) {
	/*	example, TODO dodać obiekty do pobrania *
	dwnldr.newFile('./obj/crate.json', function (response) {
		game.crate = JSON.parse(response);
	});
	/*		*/
	log.d("OK");
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
		log.e("Failed to load WebGL :(");
		return;
	}
	log.d("OK");
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
		log.e("Could not initialise shaders");
		return;
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

	log.d("OK");
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
function initTextures(gra) {

	log.d("Ładowanie tekstury 'brick.gif'");
	tex1 = gl.createTexture();
	gra.textures["brick"] = loadImg("brick.gif", tex1);

	log.d("Ładowanie tekstury 'trawa3.gif'");
	tex2 = gl.createTexture();
	gra.textures["grass"] = loadImg("trawa3.gif", tex2);

	log.d("Ładowanie tekstury 'crate.gif'");
	tex3 = gl.createTexture();
	gra.textures["crate"] = loadImg("crate.gif", tex3);

	log.d("Ładowanie tekstury 'target_tex.gif'");
	tex4 = gl.createTexture();
	gra.textures["target_tex"] = loadImg("target_tex.gif", tex4);

	log.d("Ładowanie tekstury 'steel.gif'");
	tex5 = gl.createTexture();
	gra.textures["steel"] = loadImg("steel.gif", tex5);

	log.d("Ładowanie tekstury sword_tex.gif'");
	tex6 = gl.createTexture();
	gra.textures["sword_tex"] = loadImg("sword_tex.gif", tex6);

	log.d("Ładowanie tekstury crate_ok.gif'");
	tex7 = gl.createTexture();
	gra.textures["crate_ok"] = loadImg("crate_ok.gif", tex7);

	log.d("OK");
}	/*	initTexture()	*/

