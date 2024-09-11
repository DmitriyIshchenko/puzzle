// enums are places in separate file to avoid dependency cycles

export enum RowType {
  PICK = "pickArea",
  ASSEMBLE = "assembleArea",
}

export enum StageStatus {
  NOT_COMPLETED = "notCompleted",
  CORRECT = "correct",
  INCORRECT = "incorrect",
  AUTOCOMPLETED = "autocompleted",
}
