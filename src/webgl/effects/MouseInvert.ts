import * as THREE from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { gl } from '../core/WebGL'
import fragmentShader from '../shaders/mouseInvertFrag.glsl'
import vertexShader from '../shaders/mouseInvertVert.glsl'
import { mouse2d } from '../utils/Mouse2D'

class MouseInvert {
  public pass: ShaderPass
  private mouseTarget = new THREE.Vector2()

  constructor() {
    this.pass = this.createPass()
  }

  private createPass() {
    const shader: THREE.Shader = {
      uniforms: {
        u_screenAspect: { value: gl.size.aspect },
        u_mouse: { value: new THREE.Vector2() },
      },
      vertexShader,
      fragmentShader,
    }
    return new ShaderPass(shader)
  }

  update() {
    this.pass.uniforms.u_screenAspect.value = gl.size.aspect

    this.mouseTarget.set(mouse2d.position[0], mouse2d.position[1])
    this.pass.uniforms.u_mouse.value.lerp(this.mouseTarget, 0.1)
  }
}

export const mouseInvert = new MouseInvert()
