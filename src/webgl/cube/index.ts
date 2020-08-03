import { mat4 } from 'gl-matrix';
import vertexShaderSource from './index.vert';
import fragmentShaderSource from './index.frag';
import { createProgram } from '../utils';
import { run } from '../../utils';

const toggle = <HTMLButtonElement>document.getElementById('toggle');
if (toggle === null) throw new TypeError('toggle');

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
    gl.useProgram(prog);

    /* Get the locations for shader program variables */
    const aCoords = gl.getAttribLocation(prog, "coords");
    const uModelview = gl.getUniformLocation(prog, "modelview");
    const uProjection = gl.getUniformLocation(prog, "projection");
    const uColor = gl.getUniformLocation(prog, "color");

    /* Create buffers to hold data for the attribute variables. */
    const aCoordsBuffer = gl.createBuffer();

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    const projection = mat4.create();
    const modelview = mat4.create();

    let rotateX = 0.4;   // rotation of cube about the x-axis
    let rotateY = -0.5;  // rotation of cube about the y-axis
    let rotateZ = 0;  // rotation of cube about the y-axis


    function drawPrimitive(primitiveType: number, color: Float32List, vertices: number[]) {
        gl.enableVertexAttribArray(aCoords);
        gl.bindBuffer(gl.ARRAY_BUFFER, aCoordsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STREAM_DRAW);
        gl.uniform4fv(uColor, color);
        gl.vertexAttribPointer(aCoords, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(primitiveType, 0, vertices.length / 3);
    }

    let prevEvent: MouseEvent | TouchEvent | null = null;
    function start(event: MouseEvent | TouchEvent) {
        prevEvent = event;
    }
    function move(event: MouseEvent | TouchEvent) {
        if (window.MouseEvent && event instanceof MouseEvent && prevEvent instanceof MouseEvent) {
            rotateY += (event.x - prevEvent.x) * 0.01 * Math.cos(rotateX);
            rotateX += (event.y - prevEvent.y) * 0.01;

            prevEvent = event;
        }
        if (window.TouchEvent && event instanceof TouchEvent && prevEvent instanceof TouchEvent) {
            rotateY += (event.touches[0].clientX - prevEvent.touches[0].clientX) * 0.01 * Math.cos(rotateX);
            rotateX += (event.touches[0].clientY - prevEvent.touches[0].clientY) * 0.01;

            prevEvent = event;
        }
    }
    function stop(event: MouseEvent | TouchEvent) {
        prevEvent = null;
    }
    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseup', stop);
    canvas.addEventListener('mouseleave', stop);
    canvas.addEventListener('touchstart', start);
    canvas.addEventListener('touchmove', move);
    canvas.addEventListener('touchend', stop);
    canvas.addEventListener('touchcancel', stop);

    let perspective = true;
    toggle.addEventListener('click', () => {
        perspective = !perspective;
    });

    return function (time: number) {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const aspect = canvas.width / canvas.height;
        if (perspective)
            mat4.perspective(projection, Math.PI / 4, aspect, 4, 8);
        else {
            const top = Math.max(2.5 / aspect, 2.5);
            const right = Math.max(2.5 * aspect, 2.5);
            mat4.ortho(projection, -right, right, -top, top, 4, 8);
        }

        gl.uniformMatrix4fv(uProjection, false, projection);

        mat4.lookAt(modelview, [0, 0, 6], [0, 0, 0], [0, 1, 0]);
        mat4.rotateX(modelview, modelview, rotateX);
        mat4.rotateY(modelview, modelview, rotateY);
        mat4.rotateZ(modelview, modelview, rotateZ);
        gl.uniformMatrix4fv(uModelview, false, modelview);

        drawPrimitive(gl.TRIANGLE_FAN, [0, 1, 0, 1], [-1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1, -1]);
        drawPrimitive(gl.TRIANGLE_FAN, [1, 0, 0, 1], [-1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1]);
        drawPrimitive(gl.TRIANGLE_FAN, [0, 0, 1, 1], [-1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1]);
        drawPrimitive(gl.TRIANGLE_FAN, [1, 1, 0, 1], [-1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1]);
        drawPrimitive(gl.TRIANGLE_FAN, [1, 0, 1, 1], [1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1]);
        drawPrimitive(gl.TRIANGLE_FAN, [0, 1, 1, 1], [-1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1]);
        gl.lineWidth(4);
        drawPrimitive(gl.LINES, [1, 0, 0, 1], [-2, 0, 0, 2, 0, 0]);
        drawPrimitive(gl.LINES, [0, 1, 0, 1], [0, -2, 0, 0, 2, 0]);
        drawPrimitive(gl.LINES, [0, 0, 1, 1], [0, 0, -2, 0, 0, 2]);
        gl.lineWidth(1);
    };
};

run(draw(gl))
