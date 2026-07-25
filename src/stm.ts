import { type AnyStateMachine, setup } from 'xstate';
import type { App, Obj3DPointerEvent, SceneReadyEvent } from "illutions";

import { classes } from './classes';

// Define event-driven character animation and button behavior with a state machine
export function createStateMachine(app: App<typeof classes>): AnyStateMachine {
  const { engine, objs3D, raycast } = app;
  
  // Blend smoothly when switching between character animations
  const fadeDura = 0.5;

  // Map readable action names to the armature animation clips
  const char = {
    layer: 'Armature',
    clips: {
      throw: 'Armature|Armature|Throw',
      lay: 'Armature|Armature|Lay',
      jump: 'Armature|Armature|Jump',
      yes: 'Armature|Armature|Yes',
    },
  } as const;

  // Keep the selectable GLTF object names in one place
  const buts = {
    but1: 'Button1',
    but2: 'Button2',
    but3: 'Button3',
    but4: 'Button4',
  } as const;

  // Define shared interaction colors and each button's default color
  const cols = {
    selected: '#00D1E7',
    hover: '#FFE881',
    but1Def: '#FF4290',
    but2Def: '#CC3373',
    but3Def: '#992153',
    but4Def: '#661637',
  } as const;

  return setup({
    types: {} as {
      events: SceneReadyEvent | Obj3DPointerEvent;
    },
    actions: {
      // Register the four 3D buttons for pointer interaction
      trackSelectables: () => raycast.trackSelectables({ objs3D: [objs3D.Button1, objs3D.Button2, objs3D.Button3, objs3D.Button4] }),
      // Hold the opening pose until the user chooses an animation
      setCharStartPose: () => engine.playClip({ layer: char.layer, clip: char.clips.throw, reset: true, endSpeed: 0 }),
      // Blend to the animation selected by each button
      playCharThrow: () => engine.playClip({ layer: char.layer, clip: char.clips.throw, fadeDuration: fadeDura, reset: true }),
      playCharSitting: () => engine.playClip({ layer: char.layer, clip: char.clips.lay, fadeDuration: fadeDura, reset: true }),
      playCcharJump: () => engine.playClip({ layer: char.layer, clip: char.clips.jump, fadeDuration: fadeDura, reset: true }),
      playCharYes: () => engine.playClip({ layer: char.layer, clip: char.clips.yes, fadeDuration: fadeDura, reset: true }),
      // Update button materials for selected, default, and hover states
      selectBut1: () => engine.setMaterialProperties({ obj: buts.but1, color: cols.selected }),
      deselectBut1: () => engine.setMaterialProperties({ obj: buts.but1, color: cols.but1Def }),
      hoverBut1: () => engine.setMaterialProperties({ obj: buts.but1, color: cols.hover }),
      selectBut2: () => engine.setMaterialProperties({ obj: buts.but2, color: cols.selected }),
      deselectBut2: () => engine.setMaterialProperties({ obj: buts.but2, color: cols.but2Def }),
      hoverBut2: () => engine.setMaterialProperties({ obj: buts.but2, color: cols.hover }),
      selectBut3: () => engine.setMaterialProperties({ obj: buts.but3, color: cols.selected }),
      deselectBut3: () => engine.setMaterialProperties({ obj: buts.but3, color: cols.but3Def }),
      hoverBut3: () => engine.setMaterialProperties({ obj: buts.but3, color: cols.hover }),
      selectBut4: () => engine.setMaterialProperties({ obj: buts.but4, color: cols.selected }),
      deselectBut4: () => engine.setMaterialProperties({ obj: buts.but4, color: cols.but4Def }),
      hoverBut4: () => engine.setMaterialProperties({ obj: buts.but4, color: cols.hover }),
    },
    guards: {
      // Match pointer events to the corresponding 3D button
      isBut1: ({ event }) => 'objName' in event && event.objName === buts.but1,
      isBut2: ({ event }) => 'objName' in event && event.objName === buts.but2,
      isBut3: ({ event }) => 'objName' in event && event.objName === buts.but3,
      isBut4: ({ event }) => 'objName' in event && event.objName === buts.but4,
    },
  }).createMachine({
    id: 'App',
    initial: 'Init',
    states: {
      Init: {
        on: {
          SCENE_READY: {
            target: 'Idle',
            actions: ['trackSelectables', 'setCharStartPose'],
          },
        },
      },
      Idle: {
        on: {
          OBJ3D_POINTER_LEAVE: [
            { guard: 'isBut1', actions: 'deselectBut1' },
            { guard: 'isBut2', actions: 'deselectBut2' },
            { guard: 'isBut3', actions: 'deselectBut3' },
            { guard: 'isBut4', actions: 'deselectBut4' },
          ],
        },
      },
      charThrow: {
        entry: ['playCharThrow', 'selectBut1'],
        exit: 'deselectBut1',
        on: {
          OBJ3D_POINTER_LEAVE: [
            { guard: 'isBut1', actions: 'selectBut1' },
            { guard: 'isBut2', actions: 'deselectBut2' },
            { guard: 'isBut3', actions: 'deselectBut3' },
            { guard: 'isBut4', actions: 'deselectBut4' },
          ],
        },
      },
      charSitting: {
        entry: ['playCharSitting', 'selectBut2'],
        exit: 'deselectBut2',
        on: {
          OBJ3D_POINTER_LEAVE: [
            { guard: 'isBut1', actions: 'deselectBut1' },
            { guard: 'isBut2', actions: 'selectBut2' },
            { guard: 'isBut3', actions: 'deselectBut3' },
            { guard: 'isBut4', actions: 'deselectBut4' },
          ],
        },
      },
      charJump: {
        entry: ['playCcharJump', 'selectBut3'],
        exit: 'deselectBut3',
        on: {
          OBJ3D_POINTER_LEAVE: [
            { guard: 'isBut1', actions: 'deselectBut1' },
            { guard: 'isBut2', actions: 'deselectBut2' },
            { guard: 'isBut3', actions: 'selectBut3' },
            { guard: 'isBut4', actions: 'deselectBut4' },
          ],
        },
      },
      charYes: {
        entry: ['playCharYes', 'selectBut4'],
        exit: 'deselectBut4',
        on: {
          OBJ3D_POINTER_LEAVE: [
            { guard: 'isBut1', actions: 'deselectBut1' },
            { guard: 'isBut2', actions: 'deselectBut2' },
            { guard: 'isBut3', actions: 'deselectBut3' },
            { guard: 'isBut4', actions: 'selectBut4' },
          ],
        },
      },
    },
    on: {
      OBJ3D_POINTER_ENTER: [
        { guard: 'isBut1', actions: 'hoverBut1' },
        { guard: 'isBut2', actions: 'hoverBut2' },
        { guard: 'isBut3', actions: 'hoverBut3' },
        { guard: 'isBut4', actions: 'hoverBut4' },
      ],
      OBJ3D_CLICK: [
        { target: '#App.charThrow', guard: 'isBut1' },
        { target: '#App.charSitting', guard: 'isBut2' },
        { target: '#App.charJump', guard: 'isBut3' },
        { target: '#App.charYes', guard: 'isBut4' },
      ],
    },
  });
}
