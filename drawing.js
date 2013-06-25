var gl;

var shaderProgram;

var lastTime = 0;

var textures = {};

var M, V, P;

var mStack, vStack, pStack;

/*		*/
function drawScene() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}	/*	drawScene ()	*/

/*	TODO	*/
function mvPushMatrix() {
	var copy = mat4.create();
	mat4.set(mvMatrix, copy);
	mvMatrixStack.push(copy);
}	/*	mvPushMatrix()	*/

/*	TODO	*/
function mvPopMatrix() {
	if (mvMatrixStack.length < 1) {
		throw "Inwalid mvMatrixStack!";
	}
	mvMatrix = mvMatrixStack.pop();
}	/*	mvPopMatrix()	*/

/*		*/
function setMatrixUniforms() {
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

	var normalMatrix = mat3.create();
	mat4.toInverseMat3(mvMatrix, normalMatrix);
	mat3.transpose(normalMatrix);
	gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
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
		/*	I like to move it, move it!	*/
		
	}
	lastTime = timeNow;
}	/*	animate()	*/
