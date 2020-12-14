import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';
dayjs.locale('ja');
dayjs.extend(duration);

export default class Formatter {
  // TODO: JSの場合、クラスメソッド、インスタンスメソッドの使い分けについては？
  // 秒数をHH:mm:ssの文字列に変換して返す
  static toElapsedTime = (time) => {
    const dayjsTime = dayjs(time * 1000).add(-9, 'hours');
    const dur = dayjs.duration({ seconds: time });
    // TODO: duration.format()がリリースされたら書き換える
    let h = Math.floor(dur.asHours());
    let m = dayjsTime.minute();
    let s = dayjsTime.second();

    h = ('0' + h).slice(-2);
    m = ('0' + m).slice(-2);
    s = ('0' + s).slice(-2);

    return h + ' : ' + m + ' : ' + s;
  };

  // 記録が停止された際の時間（hh:mm:ss）をミリ秒に変換する
  static toMiliSecond = () => {
    return;
  };

  // 文字列の日時情報をYYYY/MM/DDに変換
  static toDate = (date) => {
    return dayjs(date).format('YYYY/MM/DD');
  };
}
