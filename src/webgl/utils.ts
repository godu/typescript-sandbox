
/* Creates a program for use in the WebGL context gl, and returns the
 * identifier for that program.  If an error occurs while compiling or
 * linking the program, an exception of type String is thrown.  The error
 * string contains the compilation or linking error.  If no error occurs,
 * the program identifier is the return value of the function.
 */
export function createProgram(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string) {
    const vsh = gl.createShader(gl.VERTEX_SHADER);
    if (vsh === null) throw new TypeError('vsh');
    gl.shaderSource(vsh, vertexShaderSource);
    gl.compileShader(vsh);
    if (!gl.getShaderParameter(vsh, gl.COMPILE_STATUS)) {
        throw new Error("Error in vertex shader : " + gl.getShaderInfoLog(vsh));
    }


    const fsh = gl.createShader(gl.FRAGMENT_SHADER);
    if (fsh === null) throw new TypeError('fsh');
    gl.shaderSource(fsh, fragmentShaderSource);
    gl.compileShader(fsh);
    if (!gl.getShaderParameter(fsh, gl.COMPILE_STATUS)) {
        throw new Error("Error in fragment shader : " + gl.getShaderInfoLog(fsh));
    }

    const program = gl.createProgram();
    if (program === null) throw new TypeError('program');
    gl.attachShader(program, vsh);
    gl.attachShader(program, fsh);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error("Link error in program:  " + gl.getProgramInfoLog(program));
    }

    return program;
}
