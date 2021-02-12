// import ImmutablePropTypes from 'react-immutable-proptypes';
// import Proptypes from 'react';
// import Formatter from 'Util/Formatter';
// import Tag from 'Models/Tag';
// import dayjs from 'dayjs';

// export default class Report extends IRecord({
//   recordedAt: null,
//   tags: IList(),
//   finishedAt: '',
//   workingTime: 0,
// }) {
//   static t = ImmutablePropTypes.recordOf({
//     recordedAt: Proptypes.instanceOf(dayjs),
//     tags: IList(),
//     finishedAt: '',
//     workingTime: 0,
//     tags: ImmutablePropTypes.list,
//     finishedAt: Proptypes.string,
//     workingTime: Proptypes.number,
//   });

//   static fromJS = (params) => {
//     return new Task(params).withMutations((s) => {
//       s.set('finishedAt', Formatter.toDate(params.finishedAt));
//       s.set('workingTime', params.workingTime);
//       _.isEmpty(params.tags)
//         ? IList()
//         : s.set('tags', IList(params.tags.map((t) => Tag.fromJS(t))));
//     });
//   };
// }
