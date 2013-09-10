var gl;

var shaderProgram;

var lastTime = 0;

var textures = [];

var M = mat4.create();
var V = mat4.create();
var P = mat4.create();

var mStack = [];
var vStack = [];
var pStack = [];


/*	TODO - done, not tested	*/
function mStackPush() {
	var copy = mat4.create();
	mat4.set(M, copy);
	mStack.push(copy);
}	/*	mStackPush()	*/

/*	TODO - done, not tested	*/
function mStackPop() {
	if (mStack.length < 1) {
		throw "BLAD: mStack puste";
	}
	M = mStack.pop();
}	/*	mStackPop()	*/

/*	TODO - done, not tested	*/
function vStackPush() {
	var copy = mat4.create();
	mat4.set(V, copy);
	vStack.push(copy);
}	/*	vStackPush()	*/

/*	TODO - done, not tested	*/
function vStackPop() {
	if (vStack.length < 1) {
		throw "BLAD: vStack puste";
	}
	V = vStack.pop();
}	/*	vStackPop()	*/

/*	TODO - done, not tested	*/
function pStackPush() {
	var copy = mat4.create();
	mat4.set(P, copy);
	pStack.push(copy);
}	/*	pStackPush()	*/

/*	TODO - done, not tested	*/
function pStackPop() {
	if (pStack.length < 1) {
		throw "BLAD: pStack puste";
	}
	P = pStack.pop();
}	/*	pStackPop()	*/

/*		*/
function setMatrixUniforms() {
	gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, M);
	gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, V);
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, P);


	var N = mat3.create();
	mat4.toInverseMat3(V*M, N);	// TODO czy na pewno V*M ?
	mat3.transpose(N);
	gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, N);

}	/*	setMatrixUniforms()	*/

/*		*/
function degToRad(degrees) {
	return degrees * Math.PI / 180;
}	/*	degToRad()	*/

/*		*/
function animate() {
	var timeNow = new Date().getTime();
	if (lastTime != 0) {
		var elapsed = timeNow - lastTime;

// KAMERA:
		if (speed != 0) {
			xPos -= speed * elapsed * Math.sin(degToRad(yaw));
			zPos -= speed * elapsed * Math.cos(degToRad(yaw));
			yPos += speed * elapsed * Math.sin(degToRad(pitch));

			//joggingAngle += elapsed * 0.6; // 0.6 "fiddle factor" - makes it feel more realistic :-)
			//yPos = Math.sin(degToRad(joggingAngle)) / 20 + 0.4
		}

		if (speedBok != 0) {
			xPos -= speedBok * elapsed * Math.cos(degToRad(yaw));
			zPos -= speedBok * elapsed * Math.sin(degToRad(-yaw));
		}

		if (speedPion != 0) {
			yPos += speedPion * elapsed;
		}

		yaw += yawRate * elapsed;
		pitch += pitchRate * elapsed;

// PLAYER:
		if (speedPlayerX != 0) { xPlayer -= speedPlayerX * elapsed; }
		if (xPlayer < -9) xPlayer = -9;
		if (xPlayer > 9) xPlayer = 9;

		if (speedPlayerZ != 0) { zPlayer -= speedPlayerZ * elapsed; }
		if (zPlayer < -9) zPlayer = -9;
		if (zPlayer > 9) zPlayer = 9;

	}
	lastTime = timeNow;
}	/*	animate()	*/
