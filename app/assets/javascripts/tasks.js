document.addEventListener('turbolinks:load', function () {
  // オンカーソルされたタスクの背景色を変更する
  document.querySelectorAll('td').forEach(function (td) {
    td.addEventListener('mouseover', function (e) {
      e.currentTarget.style.backgroundColor = '#eff';
    });

    td.addEventListener('mouseout', function (e) {
      e.currentTarget.style.backgroundColor = '';
    });
  });

  let timer = document.getElementById('timer');
  let start = document.getElementById('start');

  // 経過時間更新用
  let elapsedTime = 0;

  let startTime;
  let timerId;
  let timeToAdd = 0;

  const updateTimeText = () => {
    elapsedTimeSec = elapsedTime / 1000;
    let h = Math.floor(elapsedTimeSec / 3600);
    let m = Math.floor(elapsedTimeSec / 60);
    // 60秒経過毎に00に戻すため、60の剰余を入れている
    let s = Math.floor(elapsedTimeSec % 60);

    // TODO:日付、時刻のフォーマッターを定義したい（勝手に00:00:00の表示にしてくれるなど）
    // TODO:js内で使用するヘルパーの定義
    h = ('0' + h).slice(-2);
    m = ('0' + m).slice(-2);
    s = ('0' + s).slice(-2);

    timer.textContent = h + ':' + m + ':' + s;
  };

  // 経過時間の算出
  // 表示部分の書き換え処理は1秒単位で呼び出す
  function countUp() {
    timerId = setTimeout(() => {
      // ★現在時刻 - startが押された時刻を逐一計測することで経過時間を算出する
      // この時、timeToAddを足しているのは、タイマーを一度停止して再開した際に、それまでの経過時間を保存しておくため
      elapsedTime = Date.now() - startTime + timeToAdd;
      updateTimeText();
      countUp();
    }, 1000);
  }

  start.addEventListener('click', () => {
    if (start.textContent == 'start') {
      start.textContent = 'stop';
      startTime = Date.now();
      //
      countUp();
    } else {
      start.textContent = 'start';
      clearTimeout(timerId);
      // stopが押されたタイミングの時刻（Date.now()）とstartが押された時刻（starttime）の差分=経過時間をtimeToAddに加算しておく
      timeToAdd += Date.now() - startTime;
    }
  });
});
