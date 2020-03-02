import { log } from "../../utils/dev/log";
const _log = log(false, "Size");

export default class Size {
  constructor(element) {
    this.el = element;
    this.width;
    this.height;

    this.isWindow = false;
    if (this.el === window) {
      this.isWindow = true;
    }

    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
  }

  resize() {
    if (this.isWindow) {
      this.width = this.el.innerWidth;
      this.height = this.el.innerHeight;
    } else {
      this.width = this.el.offsetWidth;
      this.height = this.el.offsetHeight;
    }
    _log(this);
  }
}
