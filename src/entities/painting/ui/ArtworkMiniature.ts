import { Component, div, img, p, IMAGES_BASE_URL } from "../../../shared";

import { type Painting } from "..";

import styles from "./ArtworkMiniature.module.css";

export class ArtworkMiniature extends Component {
  private image: Component<HTMLImageElement>;

  private info: Component;

  constructor(painting: Painting) {
    super({
      tag: "div",
      className: styles.miniature,
    });

    this.image = img({ src: "", alt: "", className: styles.image });
    this.info = div({ className: styles.info });
    this.updateContent(painting);

    this.appendChildren([this.image, this.info]);
  }

  updateContent(painting: Painting) {
    const { name, author, year, imageSrc } = painting;

    this.image.setAttribute("src", `${IMAGES_BASE_URL}/${imageSrc}`);
    this.image.setAttribute("alt", name);

    this.info.clear();
    [name, author, year].forEach((value) => {
      this.info.append(p({ text: value }));
    });
  }
}
