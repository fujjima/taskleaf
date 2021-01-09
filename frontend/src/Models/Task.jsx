import ImmutablePropTypes from 'react-immutable-proptypes';
import Proptypes from 'react';
import Formatter from '../Util/Formatter';

export default class Task extends IRecord({
  id: null,
  name: '',
  description: '',
  // TODO: タグ機能はよ。まじで
  tags: IList(),
  // TODO: バックから文字列で来る→文字列をフォーマットするというのが主になってしまっている
  // Date→dayjsの変換が可能であれば、型をDateとかにしたい
  finishedAt: '',
  elapsedTime: 0,
}) {
  static t = ImmutablePropTypes.recordOf({
    id: Proptypes.number,
    name: Proptypes.string,
    description: Proptypes.string,
    // TODO: タグ機能はよ
    tags: ImmutablePropTypes.list,
    // TODO: バックから文字列で来る→文字列をフォーマットしてDateを生成する、というのをここでやるべきなんだよ
    finishedAt: Proptypes.string,
    elapsedTime: Proptypes.number,
  });

  // Taskモデルのビジネスロジックをこの辺りに書く

  static fromJS = (params) => {
    // Taskを生成した後に、Taskの各種パラメータをいじりたい時にwithMutationsを使用することで、最終的な編成を一回で納めることができる
    return new Task(params).withMutations((s) => {
      s.set(
        'finishedAt',
        params.finishedAt ? Formatter.toDate(params.finishedAt) : ''
      );
      s.set('elapsedTime', Formatter.toElapsedTime(params.elapsedTime));
    });
  };
}
