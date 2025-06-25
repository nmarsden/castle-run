varying vec4 vColor;

void main() {
    // Create a circular point
    float r = 0.0;
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    r = dot(cxy, cxy);
    if (r > 1.0) {
     discard;
    }
    
    gl_FragColor = vColor;
}
