import { cfg } from 'illutions';

// Display runtime information and editable settings
cfg.gui.infoBox.enable = true;
cfg.gui.inspector.enable = true;

// Define how the camera orbits around the scene
cfg.orbitCtrls.enable = true;
// cfg.orbitCtrls.autoRotate = true;
cfg.orbitCtrls.autoRotateSpeed = 0.5;
cfg.orbitCtrls.rotateSpeed = 0.5
cfg.orbitCtrls.enableDamping = true
cfg.orbitCtrls.dampingFactor = 0.025;
cfg.orbitCtrls.maxPolarAngle = 80;
cfg.orbitCtrls.maxDistance = 25;

// Load the Draco-compressed 3D scene
cfg.model.file = 'scene/character.glb';
cfg.model.compress.mesh = 'draco';

// Light the scene and background with an EXR environment
cfg.envCtrls.enable = true;
cfg.envCtrls.map = ['scene/goegap_road_256.exr'];
cfg.envCtrls.dataType = 'float';
cfg.envCtrls.environmentIntensity = 0.75
cfg.envCtrls.backgroundIntensity = 0.25;
cfg.envCtrls.rotation.y = 125
cfg.envCtrls.backgroundBlurriness = 0.5

// Smooth jagged edges in the rendered image
cfg.render.params.aa = true;

export { cfg };
