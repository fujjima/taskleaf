import ImmutablePropTypes from 'react-immutable-proptypes';
import Proptypes from 'react';

export default class Tag extends IRecord({
  id: null,
  name: '',
}) {
  static t = ImmutablePropTypes.recordOf({
    id: Proptypes.number,
    name: Proptypes.string,
  });

  static fromJS = (params) => {
    return new Tag(params).withMutations((s) => {
      s.set('id', parseInt(params.id, 10));
      s.set('name', params.name);
    });
  };
}
