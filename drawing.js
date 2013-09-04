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

/*		*/
function drawScene() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	if (floorVertexTextureCoordBuffer == null || floorVertexPositionBuffer == null	||
		wallsVertexTextureCoordBuffer == null || wallsVertexPositionBuffer == null) {
		return;
	}

	mat4.perspective(55, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, P);


	mat4.identity(M);
	mat4.identity(V);

	mat4.rotate(V, degToRad(-pitch), [1, 0, 0]);
	mat4.rotate(V, degToRad(-yaw), [0, 1, 0]);
	mat4.translate(V, [-xPos, -yPos, -zPos]);


// FLOOR:
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textures["grass"]);
	gl.uniform1i(shaderProgram.colorMapSamplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, floorVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, floorVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, floorVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, floorVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 0, floorVertexPositionBuffer.numItems);

// WALLS	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textures["brick"]);
	gl.uniform1i(shaderProgram.colorMapSamplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, wallsVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, wallsVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, wallsVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, wallsVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 0, wallsVertexPositionBuffer.numItems);
	
	
	//vStackPush();
	
// PLAYER	
	mat4.translate(M, [-xPlayer, 0.0, zPlayer]);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textures["brick"]);
	gl.uniform1i(shaderProgram.colorMapSamplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, playerVertexTextureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, playerVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, playerVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, playerVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 0, playerVertexPositionBuffer.numItems);
	
	
	//vStackPop();
		
		

	
}	/*	drawScene ()	*/


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
