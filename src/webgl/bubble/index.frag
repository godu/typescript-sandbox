precision mediump float;
varying vec4 vColor;
void main() {
    float dist = distance( vec2(0.5,0.5), gl_PointCoord );
    if ( dist > 0.5 ) {
       discard;
    }
    gl_FragColor = vColor;
}
