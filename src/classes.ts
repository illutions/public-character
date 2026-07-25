import { Mesh3D } from 'illutions';

import { Backdrop } from './objs/backdrop';
import { Camera } from './objs/camera';

export const classes = {
  // Register the customized 3D objects
  objs3D: {
    Backdrop,
    Camera,
    Armature: Mesh3D,
    Button1: Mesh3D,
    Button2: Mesh3D,
    Button3: Mesh3D,
    Button4: Mesh3D,
  },
};
