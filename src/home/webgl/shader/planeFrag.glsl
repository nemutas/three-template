struct TextureData {
  sampler2D texture;
  vec2 coveredScale;
};

uniform float u_time;
uniform TextureData u_image;
varying vec2 v_uv;

vec4 getTexture(TextureData data) {
  vec2 uv = (v_uv - 0.5) * data.coveredScale + 0.5;
  return texture2D(data.texture, uv);
}

#include '../glsl/noise.glsl'

void main() {
  vec4 tex = getTexture(u_image);
  float gray = (tex.r + tex.g + tex.b) / 3.0;
  vec3 color = vec3(gray);

  float threshold = (v_uv.x + v_uv.y) / 2.0;
  threshold = smoothstep(0.45, 0.55, threshold);
  color = mix(tex.rgb, color, threshold);

  float noise = rand(v_uv + u_time);
  color += noise * 0.1;

  gl_FragColor = vec4(color, 1.0);
}