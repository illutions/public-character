import { Mesh, ShadowMaterial } from 'three';
import { Mesh3D } from 'illutions';

export class Backdrop extends Mesh3D {
  // Called when this object is encountered while traversing the GLTF model
  public override onTraverse(objGltf: Mesh): void {
    // Turn the backdrop mesh into a transparent shadow catcher
    objGltf.material = new ShadowMaterial({ opacity: 0.75 });

    objGltf.castShadow = true;
    objGltf.receiveShadow = true;
    objGltf.frustumCulled = false;

    // Set the underlying GLTF object
    this.obj = objGltf;
  }
}
