attribute vec2 coords;
attribute vec3 vertexColor;
varying vec3 color;

void main() {
    gl_Position = vec4( coords.x, coords.y, 0.0, 1.0 );
    color = vertexColor;
}
