/**
 * 
 */

var sokoban = new game();

/*		*/
function main () {
	initGL(document.getElementById("canvas"));
	
	$('#loadingPage').fadeOut(1000);
	
	initShaders();
	initTextures();
	downloadObjects();
	downloadTextures();
	
	gl.clearColor(0.0, 0.0, 0.2, 1.0);
	gl.enable(gl.DEPTH_TEST);
	
	
	tick();
	
	sokoban.start();
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
function tick() {
	requestAnimFrame(tick);	//	webgl-utils
	drawScene();
	animate();
}	/*	tick()	*/

/*		*/
function downloadObjects () {
	/* loadFile("./crate.json", null, function () {
		// TODO crate.prototype. ...
	}, null); /* */
}	/*	downloadObjects()	*/

/*		*/
function downloadTextures () {
	
}	/*	downloadTextures()	*/