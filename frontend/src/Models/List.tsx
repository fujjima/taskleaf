import { Task } from 'Models/Task';

// export type ListTypes = {
//   id: number
//   name: string
//   tasks: Task[]
// }
  
export class List{
  id: number;
  name: string;
  tasks: Task[];

  constructor(params?: Partial<List>) {
    Object.assign(this, params);
  }

  toJS(params){
    return JSON.stringify(params)
  }
}