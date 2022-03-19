export class Tag {
  id?: number;
  name?: string;

  constructor(params: Partial<Tag>) {
    Object.assign(this, params);
  }
  // static fromJS = (params: TagInfo) => {
  //   return new
  // };
}
