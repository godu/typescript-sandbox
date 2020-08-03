import vertexShaderSource from './index.vert';
import fragmentShaderSource from './index.frag';
import { createProgram } from '../utils';
import { run } from '../../utils';

const canvas = <HTMLCanvasElement>document.getElementById('app');
if (canvas === null) throw new TypeError('canvas');
const gl = canvas.getContext('webgl');
if (gl === null) throw new TypeError('webgl');

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
window.onresize = function () { // reset canvas size when window size is changed
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
}

function draw(gl: WebGLRenderingContext) {
    const prog = createProgram(gl, vertexShaderSource, fragmentShaderSource);

    /* Get the locations for shader program variables */
    const aCoords = gl.getAttribLocation(prog, "coords");
    const aColor = gl.getAttribLocation(prog, "color");
    const aPointSize = gl.getAttribLocation(prog, "pointSize");

    /* Create buffers to hold data for the attribute variables. */
    const aColorBuffer = gl.createBuffer();
    const aCoordsBuffer = gl.createBuffer();
    const aPointSizeBuffer = gl.createBuffer();


    const POINT_COUNT = 200;
    const POINTSIZE_MIN = 50;
    const POINTSIZE_MAX = 255;  // maximum possible value, since I'm using Uint8Array for the point sizes
    const ALPHA_MIN = 0.2;
    const ALPHA_MAX = 0.7;
    const SPEED_MIN = 0.005;
    const SPEED_MAX = 0.015;

    const coords = new Float32Array(2 * POINT_COUNT);
    const velocities = new Float32Array(2 * POINT_COUNT);
    const colors = new Float32Array(4 * POINT_COUNT);
    const pointSizes = new Uint8Array(POINT_COUNT);

    /* Set up data arrays. */
    for (let i = 0; i < POINT_COUNT; i++) {
        pointSizes[i] = Math.round(POINTSIZE_MIN + (POINTSIZE_MAX - POINTSIZE_MIN)*Math.random());
        coords[2*i] = -1 + 2*Math.random();
        coords[2*i+1] = -1 + 2*Math.random();
        const speed = SPEED_MIN + (SPEED_MAX - SPEED_MIN)*Math.random();
        const angle = 2*Math.PI*Math.random();
        velocities[2*i] = Math.cos(angle) * speed;
        velocities[2*i+1] = Math.sin(angle) * speed;
        colors[4*i] = Math.random();
        colors[4*i+1] = Math.random();
        colors[4*i+2] = Math.random();
        colors[4*i+3] = ALPHA_MIN + (ALPHA_MAX - ALPHA_MIN)*Math.random();
    }

    /* Load color and point sizes into the buffers; this data doesn't change after initialization. */
    gl.enableVertexAttribArray(aColor);
    gl.bindBuffer(gl.ARRAY_BUFFER, aColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPointSize);
    gl.bindBuffer(gl.ARRAY_BUFFER, aPointSizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, pointSizes, gl.STATIC_DRAW);
    gl.vertexAttribPointer(aPointSize, 1, gl.UNSIGNED_BYTE, false, 0, 0);

    gl.useProgram(prog);

    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE);
    gl.enable(gl.BLEND);



    return function (time: number) {
        for (let i = 0; i < coords.length; i++) {
            coords[i] += velocities[i]
            if (coords[i] < -1) {
                coords[i] = -1;
                velocities[i] = Math.abs(velocities[i]);
            }
            if (coords[i] > 1) {
                coords[i] = 1;
                velocities[i] = -Math.abs(velocities[i]);
            }
        }

        gl.clearColor(1,1,1,1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.enableVertexAttribArray(aCoords);
        gl.bindBuffer(gl.ARRAY_BUFFER, aCoordsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, coords, gl.STREAM_DRAW);
        gl.vertexAttribPointer(aCoords, 2, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.POINTS, 0, POINT_COUNT);
    };
};

run(draw(gl))
