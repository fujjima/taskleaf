import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/ja';
dayjs.locale('ja');
dayjs.extend(duration);

export default class Formatter {
  // TODO: JSの場合、クラスメソッド、インスタンスメソッドの使い分けについては？

  // 24:00:00以上でカウントできるようにしたい
  // 返す際は文字列にする
  //
  static toElapsedTime = (time) => {
    // XXX: dayjsに秒数のみ与えると、時間が+9時間されている。GMTから見た日本時間が加算されているようだが詳細は不明なので、9時間分引いている
    const t = dayjs(time);
    console.log(dayjs.duration({ seconds: 14300 }).asHours());
    const h = dayjs.duration().asHours();
    const m = t.minute;
    const s = t.second;
    console.log(h, m, s);

    return dayjs(time).add(-9, 'hours').format('HH:mm:ss');
  };

  // 記録が停止された際の時間（hh:mm:ss）をミリビョウに変換する
  static toMiliSecond = () => {
    return;
  };

  // 文字列の日時情報をYYYY/MM/DDに変換
  static toDate = (date) => {
    return dayjs(date).format('YYYY/MM/DD');
  };
}
