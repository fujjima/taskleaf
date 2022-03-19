import ImmutablePropTypes from 'react-immutable-proptypes';
import Proptypes from 'react';
import Formatter from 'Util/Formatter';
import { Tag } from 'Models/Tag';

export default class Task extends IRecord({
  id: null,
  name: '',
  description: '',
  status: '',
  tags: new Array,
  // TODO: バックから文字列で来る→文字列をフォーマットするというのが主になってしまっている
  finishedAt: '',
  workingTime: 0,
}) {
  static t = ImmutablePropTypes.recordOf({
    id: Proptypes.number,
    name: Proptypes.string,
    description: Proptypes.string,
    status: Proptypes.string,
    tags: ImmutablePropTypes.list,
    finishedAt: Proptypes.string,
    workingTime: Proptypes.number,
  });

  get statusLabel() {
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

  static fromJS = (params) => {
    return new Task(params).withMutations((s) => {
      s.set('finishedAt', Formatter.toDate(params.finishedAt));
      s.set('workingTime', params.workingTime);
      _.isEmpty(params.tags)
        ? s.set('tags', new Array)
        : s.set('tags', params.tags.map((t) => new Tag(t)))
    });
  };
}
