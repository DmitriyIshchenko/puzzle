export const RowType = {
  PICK: "pickArea",
  ASSEMBLE: "assembleArea",
} as const;

export type RowType = (typeof RowType)[keyof typeof RowType];
