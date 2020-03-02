import { log } from "../../utils/dev/log";
const _log = log(true, "add3d");

//three.js imports
import * as THREE from "three";
import View3D from "./view/view3d";
import Pyramide from "./scene/Pyramide";

let view3d = null;
let pyramide = null;
export default function init(element) {
  view3d = new View3D(element);
  view3d.start();

  pyramide = new Pyramide();
  view3d.scene.add(pyramide.group);
  view3d.addInteractiveObjects(pyramide.interactiveObjects);
}

function setupTestCubes() {
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  function rand(min, max) {
    if (max === undefined) {
      max = min;
      min = 0;
    }
    return min + (max - min) * Math.random();
  }

  function randomColor() {
    return `hsl(${rand(360) | 0}, ${rand(50, 100) | 0}%, 50%)`;
  }

  const numObjects = 100;
  for (let i = 0; i < numObjects; ++i) {
    const material = new THREE.MeshPhongMaterial({
      color: randomColor()
    });

    const cube = new THREE.Mesh(geometry, material);
    view3d.scene.add(cube);

    cube.position.set(rand(-20, 20), rand(-20, 20), rand(-20, 20));
    cube.rotation.set(rand(Math.PI), rand(Math.PI), 0);
    cube.scale.set(rand(3, 6), rand(3, 6), rand(3, 6));

    view3d.interactiveObjects.push(cube);
  }
}
