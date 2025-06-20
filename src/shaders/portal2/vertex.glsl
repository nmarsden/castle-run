varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

void main() {
    // Position
    vec4 worldPos = modelMatrix * vec4(position, 1.0);

    // Final position
    gl_Position = projectionMatrix * viewMatrix * worldPos;

    // Varyings
    vUv = uv;
    vWorldPosition = worldPos.xyz;
    vWorldNormal = normalize(normalMatrix * normal); // Or inverseTranspose(modelMatrix) * normal
}