import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';
dayjs.locale('ja');
dayjs.extend(duration);

export default class DateUtil {
  static isAftertoday = (date) => {
    if (!date || !date.isValid()) return false;
    // 当日の場合false
    return dayjs().endOf('day').isAfter(date, 'date');
  };

  static todayString = () => {
    return dayjs().format('YYYY-MM-DD');
  };
}
