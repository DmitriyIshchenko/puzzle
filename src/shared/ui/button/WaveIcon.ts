/*
  The whole purpose of this class it to create an animated svg icon. I couldn't figure out the way to get access to each path to control animation, so I had to manually create these paths.
*/

import styles from "./WaveIcon.module.css";

// TODO: there is probably a better way to get paths, instead of hardcoding them here
const lines = [
  "m 2,6.5 a 0.5,0.5 0 0 1 0.5,0.5 v 2 a 0.5,0.5 0 0 1 -1,0 V 7 a 0.5,0.5 0 0 1 0.5,-0.5",
  "m 8,2 a 0.5,0.5 0 0 1 0.5,0.5 V 13.5 A 0.5,0.5 0 0 1 7.5,13.5 V 2.5 a 0.5,0.5 0 0 1 0.5,-0.5",
  "m 4,5.5 a 0.5,0.5 0 0 1 0.5,0.5 v 4 a 0.5,0.5 0 0 1 -1,0 v -4 a 0.5,0.5 0 0 1 0.5,-0.5",
  "m 6,4a 0.5,0.5 0 0 1 0.5,0.5 V 11.5 a 0.5,0.5 0 0 1 -1,0 V 4.5 a 0.5,0.5 0 0 1 0.5,-0.5",
  "m 10,4a 0.5,0.5 0 0 1 0.5,0.5 V 11.5 a 0.5,0.5 0 0 1 -1,0 V 4.5 A 0.5,0.5 0 0 1 10,4",
  "m 12,5.5 a 0.5,0.5 0 0 1 0.5,0.5 v 4 a 0.5,0.5 0 0 1 -1,0 v -4 a 0.5,0.5 0 0 1 0.5,-0.5",
  "m 14,6.5 a 0.5,0.5 0 0 1 0.5,0.5 v 2 a 0.5,0.5 0 0 1 -1,0 V 7 a 0.5,0.5 0 0 1 0.5,-0.5",
];

const SVG_URI = "http://www.w3.org/2000/svg";

export class WaveIcon {
  public svg: SVGSVGElement;

  constructor() {
    this.svg = document.createElementNS(SVG_URI, "svg");
    this.svg.setAttributeNS(null, "id", styles.wave);
    this.svg.setAttributeNS(null, "viewBox", "0 0 16 16");
    this.svg.setAttributeNS(null, "data-animated", "false");

    this.createPaths();
  }

  private createPaths() {
    lines.forEach((line, index) => {
      const path = document.createElementNS(SVG_URI, "path");
      path.setAttributeNS(null, "d", line);
      path.style.animationDelay = `${index * 0.15}s`;

      this.svg.append(path);
    });
  }

  startAnimation() {
    this.svg.setAttributeNS(null, "data-animated", "true");
  }

  stopAnimation() {
    this.svg.setAttributeNS(null, "data-animated", "false");
  }
}
