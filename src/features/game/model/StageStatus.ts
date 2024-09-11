// to avoid dependency cycles
export const StageStatus = {
  NOT_COMPLETED: "notCompleted",
  CORRECT: "correct",
  INCORRECT: "incorrect",
  AUTOCOMPLETED: "autocompleted",
} as const;

export type StageStatus = (typeof StageStatus)[keyof typeof StageStatus];
