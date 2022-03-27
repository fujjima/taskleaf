import Formatter from 'Util/Formatter';
import { Tag } from 'Models/Tag';

export class Task{
  id: number;
  name: string;
  description: string;
  status: string;
  tags: Tag[];
  // TODO: バックから文字列で来る→文字列をフォーマットするというのが主になってしまっている
  finishedAt: string | undefined;
  workingTime: number;

  constructor(params: Partial<Task>) {
    // params内のfinishedAtのみdate形式に変換しておく
    const param = params?.finishedAt ? { ...params, ...{finishedAt: Formatter.toDate(params.finishedAt)}}
                                      : params
    Object.assign(this, param);
  }

  get statusLabel(): string {
    switch (this.status) {
      case 'waiting':
        return '未着手';
      case 'working':
        return '作業中';
      case 'completed':
        return '完了';
      case 'pending':
        return '保留';
      default:
        return '未定義';
    }
  }
}