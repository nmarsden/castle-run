  attribute vec3 velocity;
  attribute float size;
  attribute vec3 color;

  varying vec4 vColor;

  uniform float uProgress;
  uniform float uRadius;

  void main() {
    float progress = uProgress;

    // Fade out based on progress
    float opacity = 1.0 - progress;

    // Scale down based on progress
    float currentSize = size * (1.0 - progress * 0.8);

    // Update position based on progress
    vec3 finalPosition = position + (velocity * progress * uRadius * 2.0);

    // Set gl_Position to finalPosition transformed to clip space
    gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPosition, 1.0);

    // Set gl_PoinSize to perspective scaled size
    vec4 mvPosition = modelViewMatrix * vec4(finalPosition, 1.0);
    gl_PointSize = currentSize * (1.0 / -mvPosition.z); 

    // Pass color and opacity to fragment shader
    vColor = vec4(color, opacity);
  }