export interface Word {
  readonly correctPosition: number;
  text: string;
  width: number;
  isLast: boolean;
  offset: number;
  stage: number;
  image: string;
}
