import { log } from "../../../utils/dev/log";
const _log = log(true, "View3D");

//dat ui
import * as dat from "dat.gui";
const debug = true;

// utils
import Size from "./../../utils/Size";
import PickHelper from "./../../utils/PickHelper";
import * as EventBus from "../../event/EventBus";
//three.js imports
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module";

export default class View3D {
  constructor(container) {
    this.container = container;
    this.size = new Size(this.container);
    this.renderCallbacks = [];

    this.setupScene();

    this.setupRenderer();

    this.setupCamera();

    this.setupControls();

    this.setupInteractivity();

    this.setupLights();

    this.setupHelper();

    // EventBus.subscribe("3dobject.pick", function(object) {
    //   if (object) {
    //     _log("object is active!!!", object);
    //   } else {
    //     _log("no object is active!!!");
    //   }
    // });

    this.setupDebug();

    //resize
    window.addEventListener("resize", this.resize.bind(this));
  }

  setupScene() {
    // scene
    this.scene = new THREE.Scene();
  }

  setupRenderer() {
    // renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.size.width, this.size.height);
    this.canvas = this.renderer.domElement;
    this.container.appendChild(this.canvas);
  }

  setupCamera() {
    //camera

    const fov = 60;
    const aspect = this.size.width / this.size.height;
    const near = 0.1;
    const far = 200;

    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    this.camera.position.set(0, 10, 50);
    this.camera.lookAt(new THREE.Vector3(0, 10, 0));
    this.scene.add(this.camera);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener("change", this.render.bind(this));
    this.controls.minDistance = 20;
    this.controls.maxDistance = 500;
    this.controls.enablePan = false;
    // this.controls.target = new THREE.Vector3(0, 50, 0);
  }

  setupLights() {
    var ambient = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambient);

    let spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(-50, 50, 100);
    spotLight.angle = THREE.Math.degToRad(30);
    spotLight.intensity = 2;
    spotLight.penumbra = 0.15;
    spotLight.decay = 1;
    spotLight.distance = 150;
    spotLight.lookAt(new THREE.Vector3(0, 0, 0));

    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 200;
    this.scene.add(spotLight);

    this.lightHelper = new THREE.SpotLightHelper(spotLight);
    this.scene.add(this.lightHelper);
  }

  setupInteractivity() {
    this.pickHelper = new PickHelper();
    this.pickPosition = { x: 0, y: 0 };
    this.interactiveObjects = [];
    this.clearPickPosition();

    this.container.addEventListener(
      "mousemove",
      this.setPickPosition.bind(this)
    );
    this.container.addEventListener(
      "mouseout",
      this.clearPickPosition.bind(this)
    );
    this.container.addEventListener(
      "mouseleave",
      this.clearPickPosition.bind(this)
    );

    //touchSupport
    window.addEventListener(
      "touchstart",
      event => {
        // prevent the window from scrolling
        event.preventDefault();
        this.setPickPosition(event.touches[0]);
      },
      { passive: false }
    );
    window.addEventListener("touchmove", event => {
      this.setPickPosition(event.touches[0]);
    });

    window.addEventListener("touchend", this.clearPickPosition.bind(this));
  }

  addInteractiveObjects(arr) {
    this.interactiveObjects = [...this.interactiveObjects, ...arr];
    _log(this.interactiveObjects);
  }

  clearPickPosition() {
    // unlike the mouse which always has a position
    // if the user stops touching the screen we want
    // to stop picking. For now we just pick a value
    // unlikely to pick something
    this.pickPosition.x = -100000;
    this.pickPosition.y = -100000;
  }
  setPickPosition(event) {
    const pos = this.getCanvasRelativePosition(event);
    this.pickPosition.x = (pos.x / this.canvas.clientWidth) * 2 - 1;
    this.pickPosition.y = (pos.y / this.canvas.clientHeight) * -2 + 1; // note we flip Y
    // _log(this.pickPosition);
  }

  getCanvasRelativePosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  setupHelper() {
    this.scene.add(new THREE.AxesHelper(100));

    var polarGridHelper = new THREE.PolarGridHelper(
      50,
      16,
      8,
      64,
      0x0000ff,
      0x808080
    );
    // this.scene.add(polarGridHelper);

    var gridHelper = new THREE.GridHelper(100, 10, 0x0000ff, 0x808080);
    this.scene.add(gridHelper);
  }

  setupDebug() {
    //dat gui
    if (debug) {
      this.datgui = new dat.GUI({ autoPlace: false });
      this.container.appendChild(this.datgui.domElement);
      const style = {
        position: "absolute",
        right: "0",
        top: "0",
        zIndex: "10000"
      };
      Object.assign(this.datgui.domElement.style, style);

      const datGuiCamera = this.datgui.addFolder("camera");
      datGuiCamera.add(this.camera, "fov", 0, 100).onChange(val => {
        this.camera.fov = val;
        this.camera.updateProjectionMatrix();
      });

      this.stats = new Stats();
      this.container.appendChild(this.stats.dom);
      this.stats.dom.style.cssText =
        "position:absolute;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";
    }
  }

  resize() {
    _log("resize");

    //resize camera
    this.camera.aspect = this.size.width / this.size.height;
    this.camera.updateProjectionMatrix();

    //resize renderer
    this.renderer.setSize(this.size.width, this.size.height);
  }

  start() {
    this.rendering = true;
    this.tick();
  }

  stop() {
    this.rendering = false;
    window.cancelAnimationFrame(this.ticker);
    _log("stop");
  }

  render(time) {
    // _log(time);
    // update helpers
    this.lightHelper.update();

    // Render callbacks
    this.renderCallbacks.every(callback => callback());

    //
    this.pickHelper.pick(
      this.pickPosition,
      this.camera,
      this.interactiveObjects,
      time
    );
    // Render
    debug ? this.stats.begin() : null;
    this.renderer.render(this.scene, this.camera);
    debug ? this.stats.end() : null;
  }

  tick(time) {
    this.ticker = window.requestAnimationFrame(this.tick.bind(this));
    this.render(time);
  }

  addRenderCallback(callback) {
    this.renderCallbacks.push(callback);
  }
}
