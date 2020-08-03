attribute vec2 coords;
attribute vec4 color;
attribute float pointSize;
varying vec4 vColor;
void main() {
    vColor = color;
    gl_Position = vec4( coords, 0.0, 1.0 );
    gl_PointSize = pointSize;
}
