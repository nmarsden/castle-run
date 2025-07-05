varying vec4 vColor;

void main() {
    // Create a circular point
    float r = 0.0;
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    r = dot(cxy, cxy);
    if (r > 1.0) {
     discard;
    }
    
    float emissiveIntensity = 20.0;

    gl_FragColor = vec4(vColor.rgb * emissiveIntensity, vColor.a);
}
