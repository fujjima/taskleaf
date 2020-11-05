document.addEventListener('turbolinks:load', function () {
  let startNodes = document.querySelectorAll('.fas');

  let elapsedTime = 0;

  let startTime;
  let timerId;
  let timeToAdd = 0;

  function updateTimeText(id) {
    elapsedTimeSec = elapsedTime / 1000;
    let h = Math.floor(elapsedTimeSec / 3600);
    let m = Math.floor(elapsedTimeSec / 60);
    // 60秒経過毎に00に戻すため、60の剰余を入れている
    let s = Math.floor(elapsedTimeSec % 60);

    // TODO:日付、時刻のフォーマッターを定義したい（勝手に00:00:00の表示にしてくれるなど）
    h = ('0' + h).slice(-2);
    m = ('0' + m).slice(-2);
    s = ('0' + s).slice(-2);

    let timer = document.getElementById(`timer-${id}`);
    timer.textContent = h + ':' + m + ':' + s;
  }

  // 経過時間の算出
  // 表示部分の書き換え処理は1秒単位で呼び出す
  function countUp(id) {
    timerId = setTimeout(() => {
      // 経過時間=現在時刻-playが押された時刻
      // タイマーを一度停止して再開した際に、それまでの経過時間を保存しておくためtimeToAddを加算している
      elapsedTime = Date.now() - startTime + timeToAdd;
      updateTimeText(id);
      countUp(id);
    }, 1000);
  }

  startNodes.forEach((sn) => {
    sn.addEventListener('click', () => {
      if (sn.className.includes('play')) {
        sn.className = sn.className.replace(/play/, 'stop');
        startTime = Date.now();
        countUp(sn.id);
      } else {
        sn.className = sn.className.replace(/stop/, 'play');
        // timer書き換え時にID指定を行う
        clearTimeout(timerId);
        // TODO:あるタイマーの経過時間が、他のタイマーで記録開始した際に加算されてしまう
        //  timeToAdd,startTimeが全て共通になっているから？
        // stopが押されたタイミングの時刻（Date.now()）とstartが押された時刻（starttime）の差分=経過時間をtimeToAddに加算しておく
        timeToAdd += Date.now() - startTime;
      }
    });
  });

  // オンカーソルされたタスクの背景色を変更する
  document.querySelectorAll('td').forEach(function (td) {
    td.addEventListener('mouseover', function (e) {
      e.currentTarget.style.backgroundColor = '#eff';
    });

    td.addEventListener('mouseout', function (e) {
      e.currentTarget.style.backgroundColor = '';
    });
  });

  $('i.fas').on('click', (event) => {
    // 記録が停止された際に処理される
    // バックにPOSTリクエストを飛ばす
    if ($(event.target).hasClass('fa-play')) {
    }
  });
});
