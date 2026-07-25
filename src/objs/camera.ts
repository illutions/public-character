import { Cam3D } from 'illutions';

export class Camera extends Cam3D {
  // Called once after the GLTF model has been loaded and traversed
  protected override onReady(): void {
    // Aim the camera at the marker placed in the 3D scene
    const aim = this.scene.getObjectByName('Aim');
    if (!aim) return;
    aim.getWorldPosition(this.objTarget.position);
    this.obj.lookAt(this.objTarget.position);
  }
}