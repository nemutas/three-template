uniform sampler2D tDiffuse;
uniform vec2 u_mouse;
uniform float u_screenAspect;
varying vec2 v_uv;

void main() {
  vec4 tex = texture2D(tDiffuse, v_uv);
  vec3 invert = 1.0 - tex.rgb;

  vec2 aspect = vec2(u_screenAspect, 1.0);
  vec2 mouse = u_mouse * 0.5 + 0.5;
  float dist = distance(v_uv * aspect, mouse * aspect) + sin(v_uv.x * 3.1415 * 10.0) * 0.02;
  float threshold = smoothstep(0.1, 0.101, dist);
  vec3 color = mix(invert, tex.rgb, threshold);

  gl_FragColor = vec4(color, tex.a);
}