import { log } from "../../utils/dev/log";
const _log = log(true, "ViewPixi");

// import * as PIXI from "pixi.js-legacy";
import * as PIXI from "pixi.js";
//dat ui
import * as dat from "dat.gui";
const debug = true;

// utils
import Size from "./../utils/Size";
import * as EventBus from "../event/EventBus";
//three.js imports
import { HotSpot } from "./HotSpot";

export default class ViewPixi {
  constructor(container) {
    this.container = container;
    this.size = new Size(this.container);

    //https://pixijs.download/dev/docs/PIXI.Application.html
    this.app = new PIXI.Application({
      width: 300,
      height: 200,
      transparent: true,
      antialias: true,
      resolution: 2,
      forceCanvas: true,
      resizeTo: this.container
    });

    _log(this.app);

    this.container.appendChild(this.app.view);

    this.hotspot = new HotSpot();
    this.hotspot.init({
      radius: 100,
      stage: this.app.stage
    });
    this.hotspot.x = 100;
    this.hotspot.y = 100;

    this.hotspot = new HotSpot();
    this.hotspot.init({
      radius: 100,
      stage: this.app.stage
    });
    this.hotspot.x = 500;
    this.hotspot.y = 100;

    this.hotspot.show();
    this.hotspot.hilite();

    // setTimeout(() => {
    //   this.hotspot.dehilite();
    // }, 2000);
    // this.hotspot.pulsate();

    this.setupHelper();

    this.setupDebug();

    //resize
    window.addEventListener("resize", this.resize.bind(this));
  }

  setupHelper() {}

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
      //   datGuiCamera.add(this.camera, "fov", 0, 100).onChange(val => {
      //     this.camera.fov = val;
      //     this.camera.updateProjectionMatrix();
      //   });
    }
  }

  resize() {
    _log("resize");
  }

  start() {
    this.rendering = true;
  }

  stop() {
    this.rendering = false;
  }
}
