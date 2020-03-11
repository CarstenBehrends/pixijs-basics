import { log } from "../../utils/dev/log";
const _log = log(false, "HotSpot");

import * as PIXI from "pixi.js-legacy";
import * as EventBus from "../event/EventBus";
import { gsap } from "gsap";
export class HotSpot extends PIXI.Container {
  init(params) {
    this.radius = params.radius;
    this.connections = params.connections;
    this.info = params.info;
    this.enabled = false;

    this.overlayID = 0;

    this.createCircles();
    this.createStateTimelines();
  }

  setStartPoint(point) {
    this.rawStartPoint = point;
  }

  resize(bounds) {
    this.bounds = bounds;
    this.startPoint = {
      x: (this.rawStartPoint.x * this.bounds.width) / 100,
      y: (this.rawStartPoint.y * this.bounds.height) / 100
    };

    gsap.killTweensOf(this);

    this.updateStartPoint();
    this.move();
  }
  updateStartPoint() {
    this.x = this.startPoint.x;
    this.y = this.startPoint.y;
  }

  createCircles() {
    this.innerCircles = new PIXI.Container();

    let circle1 = this.drawCircle({
      radius: this.radius,
      alpha: 1,
      color: 0xffffff
    });

    let circle2 = this.drawCircle({
      radius: this.radius * 0.776,
      alpha: 1,
      color: 0xa7e913
    });

    let circle3 = this.drawCircle({
      radius: this.radius * 0.405,
      alpha: 1,
      color: 0x2d2d2d
    });

    //stacking
    this.innerCircles.addChild(circle1);
    this.innerCircles.addChild(circle2);
    this.innerCircles.addChild(circle3);

    // Add a blur filter
    // this.innerCircles.filters = [new DropShadowFilter()];

    //outer circles
    this.outerCircles = new PIXI.Container();

    let outerCircle1 = this.drawCircle({
      radius: this.radius * 2.138,
      alpha: 0.54,
      color: 0xffffff
    });
    outerCircle1.scale.x = outerCircle1.scale.y = 0;

    let outerCircle2 = this.drawCircle({
      radius: this.radius * 1.498,
      alpha: 0.54,
      color: 0xffffff
    });
    outerCircle2.scale.x = outerCircle2.scale.y = 0;

    //stacking
    this.outerCircles.addChild(outerCircle1);
    this.outerCircles.addChild(outerCircle2);

    this.addChild(this.outerCircles);
    this.addChild(this.innerCircles);

    this.innerCircles.scale.x = this.innerCircles.scale.y = 0;
    this.outerCircles.scale.x = this.outerCircles.scale.y = 0;
  }

  drawCircle(params) {
    const graphics = new PIXI.Graphics();

    // Circle
    graphics.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
    graphics.beginFill(params.color, params.alpha);
    graphics.drawCircle(0, 0, params.radius);
    graphics.endFill();
    graphics.cacheAsBitmap = true;
    let container = new PIXI.Container();
    container.addChild(graphics);
    return container;
  }

  createStateTimelines() {
    this.showTl = gsap.timeline({
      paused: true
    });

    this.showTl.to(this.innerCircles.scale, {
      duration: 0.8,
      x: 1,
      y: 1,
      ease: "back.out"
    });

    //pulsate
    this.showOuterTl = gsap.timeline({
      paused: true
    });

    this.showOuterTl.to(this.outerCircles.scale, {
      duration: 0.5,
      x: 1,
      y: 1,
      ease: "back.out"
    });

    this.pulsateTl = gsap.timeline({
      paused: true
    });

    this.pulsateTl.to(
      this.outerCircles.children[0].scale,
      {
        duration: 1,
        x: 1,
        y: 1,
        ease: "sine.inOut"
      },
      0
    );

    this.pulsateTl.to(
      this.outerCircles.children[1].scale,
      {
        duration: 1,
        x: 1,
        y: 1,
        ease: "quint.inOut"
      },
      0
    );
  }
  start() {
    this.enabled = true;
    this.move();
  }
  stop() {
    this.enabled = false;
    gsap.killTweensOf(this);
  }

  move() {
    if (this.enabled) {
      this.dehilite();

      let duration = this.randomBetween(0.5, 3);
      let destX = this.startPoint.x + this.randomBetween(-100, 110);
      if (destX < 0 + this.radius) {
        destX = this.radius;
      }
      let destY = this.startPoint.y + this.randomBetween(-100, 110);
      if (destY < 0 + this.radius) {
        destY = this.radius;
      }

      gsap.to(this, {
        duration: duration,
        x: destX,
        y: destY,
        onComplete: this.onMoveComplete.bind(this)
      });
    }
  }

  onMoveComplete() {
    _log("moveComplete");

    let showHighlite = this.randomBetween(0, 100);

    if (showHighlite > 90 && this.info) {
      this.hilite();
      gsap.delayedCall(4, this.move.bind(this));
    } else {
      this.move();
    }
  }

  randomBetween(min, max) {
    return Math.random() * max + min;
  }

  show() {
    this.showTl.play();
  }

  hilite() {
    this.showOuterTl.play();
    this.pulsateTl.play();
    // _log("hilite", this.x, this.y);

    EventBus.publish("hotspot.found", this);
  }

  dehilite() {
    EventBus.publish("hotspot.search", this);
    this.showOuterTl.reverse();
    this.pulsateTl.reverse();
  }

  pulsate() {
    this.showOuterTl.play();
    this.pulsateTl.play();
  }
}
