const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl');
if (!gl) {
	console.error('WebGL not supported, falling back on experimental-webgl');
	gl = canvas.getContext('experimental-webgl');
}
if (!gl) {
	console.error('Your browser does not support WebGL');
	throw new Error('Your browser does not support WebGL');
}

function compileShader(gl, type, source) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
		return null;
	}
	return program;
}

const vertexShader = compileShader(gl, gl.VERTEX_SHADER, await loadfile('text', 'vertexShader.glsl'));
const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, await loadfile('text', 'fragmentShader.glsl'));
const program = createProgram(gl, vertexShader, fragmentShader);
gl.useProgram(program);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const positions = [-1, -1, 1, -1, -1, 1, 1, 1];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

export default async function (src, hueRotateValue) {
	const image = await loadimg(src);
	canvas.width = image.width;
	canvas.height = image.height;
	gl.viewport(0, 0, canvas.width, canvas.height);

	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

	const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
	gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

	const hueRotateLocation = gl.getUniformLocation(program, 'u_hueRotate');
	gl.uniform1f(hueRotateLocation, hueRotateValue);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	return await canvas2url(canvas);
};
