import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { gl } from '../core/WebGL'

class FXAA {
  public pass: ShaderPass

  constructor() {
    this.pass = this.createPass()
    this.update()
  }

  private createPass() {
    return new ShaderPass(FXAAShader)
  }

  update() {
    this.pass.material.uniforms.resolution.value.set(1 / gl.size.width, 1 / gl.size.height)
  }
}

export const fxaa = new FXAA()
