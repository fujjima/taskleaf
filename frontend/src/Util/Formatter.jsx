import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';
dayjs.locale('ja');
dayjs.extend(duration);

export default class Formatter {
  // 秒数をHH:mm:ssの文字列に変換して返す
  static toElapsedTime = (time) => {
    if (time === 0) return dayjs.duration(0);

    const dayjsTime = dayjs(time * 1000).add(-9, 'hours');
    const dur = dayjs.duration({ seconds: time });
    // TODO: duration.format()が下記のような変換をできるようになったら書き換える
    let h = Math.floor(dur.asHours());
    let m = dayjsTime.minute();
    let s = dayjsTime.second();

    h = ('0' + h).slice(-2);
    m = ('0' + m).slice(-2);
    s = ('0' + s).slice(-2);

    return dayjs.duration({ hours: h, minutes: m, seconds: s });
  };

  // hh:mm:ssを秒に変換する
  static toSecond = (time) => {
    const [h, m, s] = time.split(':');
    return dayjs.duration({ hours: h, minutes: m, seconds: s }).asSeconds();
  };

  // 文字列の日時情報をYYYY/MM/DDに変換
  static toDate = (date) => {
    return dayjs(date);
  };

  // 今日の日付を文字列形式にフォーマットする
  static todayString = () => {
    return dayjs().format('YYYY-MM-DD');
  };
}
