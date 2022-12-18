import * as THREE from 'three'
import { resolvePath } from '../scripts/utils'
import { gl } from './core/WebGL'
import { effects } from './effects/Effects'
import fragmentShader from './shaders/planeFrag.glsl'
import vertexShader from './shaders/planeVert.glsl'
import { Assets, loadAssets } from './utils/assetLoader'
import { calcCoveredTextureScale } from './utils/coveredTexture'
import { controls } from './utils/OrbitControls'

export class TCanvas {
  private animeID?: number

  private assets: Assets = {
    image: { path: resolvePath('resources/unsplash.jpg') },
  }

  constructor(private parentNode: ParentNode) {
    loadAssets(this.assets).then(() => {
      this.init()
      this.createObjects()
      this.setAnimationFrame()
    })
  }

  private init() {
    gl.setup(this.parentNode.querySelector('.three-container')!)
    gl.scene.background = new THREE.Color('#133')
    gl.camera.position.z = 1.5

    gl.setResizeCallback(() => effects.resize())
  }

  private createObjects() {
    const texture = this.assets.image.data as THREE.Texture

    const geometry = new THREE.PlaneGeometry(1.5, 1)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_image: { value: { texture, coveredScale: new THREE.Vector2(1, 1) } },
        u_time: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.name = 'plane'

    const screenAspect = geometry.parameters.width / geometry.parameters.height
    calcCoveredTextureScale(texture, screenAspect, material.uniforms.u_image.value.coveredScale)

    gl.scene.add(mesh)
  }

  // ----------------------------------
  // animation frame
  private setAnimationFrame() {
    const anime = () => {
      const dt = gl.time.getDelta()

      const plane = gl.getMesh<THREE.ShaderMaterial>('plane')
      plane.material.uniforms.u_time.value += dt

      controls.update()
      // gl.render()
      effects.render()

      requestAnimationFrame(anime)
    }
    this.animeID = requestAnimationFrame(anime)
  }

  // ----------------------------------
  // dispose
  dispose() {
    gl.dispose()
    this.animeID && cancelAnimationFrame(this.animeID)
  }
}
