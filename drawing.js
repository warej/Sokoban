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
function degToRad(degrees) {
	return degrees * Math.PI / 180;
}	/*	degToRad()	*/
