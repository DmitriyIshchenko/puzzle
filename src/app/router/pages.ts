/* This looks like a good opportunity to use an enum, 
but ESLint with strict type checking enabled throws a fit when you try to compare a primitive string to an enum member
*/

export const Pages = {
  LOGIN: "login",
  START: "start",
  GAME: "game",
  NOT_FOUND: "not-found",
};

export const RESOURCE_SELECTOR = "";
