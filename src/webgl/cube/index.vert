attribute vec3 coords;
uniform mat4 modelview;
uniform mat4 projection;
void main() {
    vec4 coords = vec4(coords,1.0);
    vec4 transformedVertex = modelview * coords;
    gl_Position = projection * transformedVertex;
}
