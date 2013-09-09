var currentlyPressedKeys = {};

function handleKeyDown(event) {
	currentlyPressedKeys[event.keyCode] = true;
    //log.d("Wciśnięto klawisz nr " + event.keyCode);
}


function handleKeyUp(event) {
	currentlyPressedKeys[event.keyCode] = false;
}



function handleKeys(gra) {
	gra.scene.handleKeys();
}