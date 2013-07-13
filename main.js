/**
 * 
 */

/*		*/
function main () {
	sokoban = new Game();
	initGL(document.getElementById("canvas"));
	
	initShaders();
	downloadObjects();
	downloadTextures();
	
	gl.clearColor(0.0, 0.0, 0.2, 1.0);
	gl.enable(gl.DEPTH_TEST);
	
	dwnldr = new Downloader(sokoban);
	
	downloadObjects(dwnldr);
	
	tick(sokoban);
}	/*	main ()	*/

/*		*/
function loadFile(url, data, callback, errorCallback) {
    // Set up an asynchronous request
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    // Hook the event that gets called as the request progresses
    request.onreadystatechange = function () {
        // If the request is "DONE" (completed or failed)
        if (request.readyState == 4) {
            // If we got HTTP status 200 (OK)
            if (request.status == 200) {
                callback(request.responseText, data);
            } else { // Failed
                errorCallback(url);
            }
        }
    };

    request.send(null);    
}	/*	loadFile()	*/

/*		*/
function downloadObjects (dwnldr) {
	// example, TODO reszta
	dwnldr.download('./crate.json');
}	/*	downloadObjects()	*/

/*		*/
function downloadTextures () {
	
}	/*	downloadTextures()	*/

/*		*/
function tick(game) {
	requestAnimFrame(tick);	//	webgl-utils
	game.draw();
	game.animate();
}	/*	tick()	*/