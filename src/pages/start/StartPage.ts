import { Router } from "../../app/router/router";
import { Pages } from "../../app/router/pages";

import { Component, Button, div, h2, h3, li, p, ul } from "../../shared/ui";

import styles from "./StartPage.module.css";

// TODO: move this somewhere else
const gameRules = [
  "Choose from six difficulty levels and various rounds to tailor your learning experience.",
  "Click on words or use drag-and-drop to arrange words into correct English sentences.",
  "If you get stuck, use translation, play the voiced recording, or enable puzzle image hints.",
  "Monitor your learning progress and review the artworks you've revealed on the statistics page.",
  "Assemble sentences correctly to gradually unveil parts of a classical artwork puzzle.",
  "When you feel ready, move on to the next challenge!",
];

export class StartPage extends Component {
  constructor(private router: Router) {
    super({
      tag: "main",
      className: styles.start,
    });

    this.configure();
  }

  configure() {
    const gameTitle = h2({
      className: styles.title,
      text: "Welcome to Puzzle game!",
    });

    const gameDescription = p({
      className: styles.description,
      text: "Step into “Puzzle game”, where words become your paint and sentences your brushstrokes! Create English sentences and reveal the secrets of famous paintings.",
    });

    const rules = gameRules.map((rule) =>
      li({ className: styles.rule, text: rule }),
    );

    const rulesTitle = h3({
      className: styles.rulesTitle,
      text: "Rules are simple:",
    });
    const rulesList = ul({ className: styles.rules }, ...rules);

    const startButton = new Button(
      "Play!",
      () => {
        this.router.navigate(Pages.GAME);
      },
      styles.button,
    );

    const descriptionBox = div(
      { className: styles.box },
      gameTitle,
      gameDescription,
      startButton,
    );
    const rulesBox = div({ className: styles.box }, rulesTitle, rulesList);

    this.appendChildren([descriptionBox, rulesBox]);
  }
}
