var currentlyPressedKeys = {};

function handleKeyDown(event) {
	currentlyPressedKeys[event.keyCode] = true;
}


function handleKeyUp(event) {
	currentlyPressedKeys[event.keyCode] = false;
}



function handleKeys(gra) {
	//game.scene.handleKeys();
	gra.scene.handleKeys();
}