  attribute vec3 velocity;
  attribute float startTime;
  attribute float duration;
  attribute float size;
  attribute vec3 color;

  varying vec4 vColor;

  uniform float uTime;
  uniform float uProgress;
  uniform float uExplosionDuration;
  uniform float uRadius;

  void main() {
    // float lifeTime = uTime - startTime;
    float progress = uProgress;
    // float progress = clamp(lifeTime / duration, 0.0, 1.0);

    // Fade out based on progress
    float opacity = 1.0 - progress;

    // Scale up and then down (or just fade out scale)
    float currentSize = size * (1.0 - progress * 0.8); // Adjust scaling as desired

    // Explosion outward movement
    // Use uRadius here!
    vec3 finalPosition = position + velocity * (progress) * uRadius * 2.0;
    // vec3 finalPosition = position + velocity * lifeTime * (1.0 - progress) * uRadius * 2.0;

    // Correctly apply model-view-projection matrix to get to clip space
    // and assign to gl_Position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPosition, 1.0); // <--- THIS IS THE MISSING CRUCIAL LINE!

    vec4 mvPosition = modelViewMatrix * vec4(finalPosition, 1.0); // Still needed for perspective point sizing
    gl_PointSize = currentSize * (1.0 / -mvPosition.z); // Perspective scaling

    // vColor = vec4(color, 1.0); // Pass color and opacity to fragment shader
    vColor = vec4(color, opacity); // Pass color and opacity to fragment shader
  }