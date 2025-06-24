uniform float uTime;        // Time for animation
uniform vec3 uColor;        // Base color of the thruster
uniform float uPower;       // Controls the intensity/length of the thruster

varying vec2 vUv;           // Received from the vertex shader

void main() {
    // Create a radial gradient for the thruster
    vec2 pos = vUv - vec2(0.5, 0.5); // Center the coordinates
    float dist = length(pos);

    // Basic glow based on distance from center
    float glow = 1.0 - smoothstep(0.0, 0.5, dist);

    // Add some flickering/animation based on time
    float flicker = sin(uTime * 30.0 + pos.y * 30.0) * 0.1 + 0.4;
    glow *= flicker;

    // Apply power and color
    vec3 finalColor = uColor * glow * uPower;

    // Make the edges fade out more quickly for a cone-like effect
    finalColor *= smoothstep(0.5, 0.0, vUv.y); // Fades from top to bottom of the UV

    gl_FragColor = vec4(finalColor, 1.0);
}