export const StageStatus = {
  NOT_COMPLETED: "notCompleted",
  CORRECT: "correct",
  INCORRECT: "incorrect",
  AUTOCOMPLETED: "autocompleted",
} as const;

export type StageStatus = (typeof StageStatus)[keyof typeof StageStatus];

export const RowType = {
  PICK: "pickArea",
  ASSEMBLE: "assembleArea",
} as const;

export type RowType = (typeof RowType)[keyof typeof RowType];
