import vertexShaderSource from './index.vert';
import fragmentShaderSource from './index.frag';
import { createProgram } from '../utils';
import {run} from '../../utils';

const plus = <HTMLButtonElement>document.getElementById('plus');
if (plus === null) throw new TypeError('plus');

const minus = <HTMLButtonElement>document.getElementById('minus');
if (minus === null) throw new TypeError('minus');

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

const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

let uColor = gl.getUniformLocation(program, "color")
let aCoords = gl.getAttribLocation(program, "coords");

let aCoordsBuffer = gl.createBuffer();

gl.useProgram(program);

function draw(gl: WebGLRenderingContext) {


    let polygonSides = 3;
    minus.addEventListener('click', () => {
        polygonSides = Math.max(3, polygonSides - 1);
    });
    plus.addEventListener('click', () => {
        polygonSides++;
    });

    return function(time: number) {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniform3f( uColor, 1, 0, 1 ); // Red

    const vertexCount = polygonSides + 1;
    const vertices = new Float32Array(2 * vertexCount);

    for (let i = 0, angle = 0; i < vertexCount; i++) {
        angle = (2 * Math.PI / polygonSides) * i + (Math.PI / 2) + (Math.PI * time * 0.001);
        vertices[2 * i] = 0.8 * Math.cos(angle);
        vertices[2 * i + 1] = 0.8 * Math.sin(angle);
    }

    gl.enableVertexAttribArray(aCoords);

    gl.bindBuffer(gl.ARRAY_BUFFER, aCoordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STREAM_DRAW);

    gl.vertexAttribPointer(aCoords, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertexCount);
};
};

run(draw(gl))
