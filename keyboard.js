var currentlyPressedKeys = {};

function handleKeyDown(event) {
	currentlyPressedKeys[event.keyCode] = true;
}


function handleKeyUp(event) {
	currentlyPressedKeys[event.keyCode] = false;
}



function handleKeys() {
	if (currentlyPressedKeys[38]) {	// GÓRA
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
	
	
	if (currentlyPressedKeys[87]) { //key W
		speedPlayerX = 0.01;
	} else if (currentlyPressedKeys[83]) { // key S
		speedPlayerX = -0.01;
	} else {
		speedPlayerX = 0;
	}
	
	
	if (currentlyPressedKeys[65]) { //key A
		speedPlayerZ = 0.01;
	} else if (currentlyPressedKeys[68]) { // key D
		speedPlayerZ = -0.01;
	} else {
		speedPlayerZ = 0;
	}

}