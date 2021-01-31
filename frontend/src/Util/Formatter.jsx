import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';
dayjs.locale('ja');
dayjs.extend(duration);

export default class Formatter {
  static fromSecondToHour = (time) => {
    if (time === 0) return '00:00:00';

    let h = Math.floor(time / (60 * 60));
    let m = Math.floor((time % (60 * 60)) / 60);
    let s = Math.floor((time % (60 * 60)) % 60);

    h = ('0' + h).slice(-2);
    m = ('0' + m).slice(-2);
    s = ('0' + s).slice(-2);

    return `${h}:${m}:${s}`;
  };

  static toSecond = (time) => {
    const [h, m, s] = time.split(':');
    return dayjs.duration({ hours: h, minutes: m, seconds: s }).asSeconds();
  };

  // 文字列の日時情報をYYYY/MM/DDに変換
  static toDate = (date) => {
    return dayjs(date);
  };

  static todayString = () => {
    return dayjs().format('YYYY-MM-DD');
  };
}
