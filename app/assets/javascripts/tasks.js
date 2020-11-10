document.addEventListener('turbolinks:load', function () {
  // オンカーソルされたタスクの背景色を変更する
  // document.querySelectorAll('td').forEach(function (td) {
  //   td.addEventListener('mouseover', function (e) {
  //     e.currentTarget.style.backgroundColor = '#eff';
  //   });

  //   td.addEventListener('mouseout', function (e) {
  //     e.currentTarget.style.backgroundColor = '';
  //   });
  // });

  let startNodes = document.querySelectorAll('.fas');
  let startTime;
  let timeToAdd;

  // TODO:各タスクの記録可能最大経過時間は99:59:59となる。これを上回るとどうなるか、また上回った場合にどうするか、を考える必要がある
  //  startTime（startが押された時刻と現時刻の差分を知るために使用するため）
  let elapsedTime = 0;

  function elapsedTimeMoment() {
    return moment(timeToAdd, 'HH:mm:ss');
  }

  // TODO:memo化しておく（何度も呼ばれるため）
  // 処理実行当日の開始時刻を返す
  function startOfToday() {
    return moment().startOf('day').unix();
  }

  function updateTimeText(id) {
    elapsedTimeSec = elapsedTime.unix() - startOfToday();
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

  // 表示部分の書き換え処理は1秒単位で呼び出す
  function countUp(id) {
    timerId = setTimeout(() => {
      // 経過時間=現在時刻-playが押された時刻
      // タイマーを一度停止して再開した際に、それまでの経過時間を保存しておくためtimeToAddを加算している
      // 24時間超えたら1日として換算するのはいいかもしれない
      elapsedTime = elapsedTimeMoment()
        .clone()
        .add(moment().diff(startTime, 's'), 's');

      updateTimeText(id);
      countUp(id);
    }, 1000);
  }

  startNodes.forEach((sn) => {
    sn.addEventListener('click', (event) => {
      if (sn.className.includes('play')) {
        timeToAdd = document.getElementById(`timer-${event.target.id}`)
          .textContent;
        sn.className = sn.className.replace(/play/, 'stop');
        startTime = moment();
        countUp(sn.id);
      } else {
        sn.className = sn.className.replace(/stop/, 'play');
        clearTimeout(timerId);
        // TODO:あるタイマーの経過時間が、他のタイマーで記録開始した際に加算されてしまう
        // stopが押されたタイミングの時刻（Date.now()）とstartが押された時刻（starttime）の差分=経過時間をtimeToAddに加算しておく
        timeToAdd += moment(Date.now()) - moment(startTime);
      }
    });
  });

  // Ajaxで送信するデータにCSRFトークンを付与する
  function set_csrfToken() {
    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
      if (!options.crossDomain) {
        const token = $('meta[name="csrf-token"]').attr('content');
        if (token) {
          return jqXHR.setRequestHeader('X-CSRF-Token', token);
        }
      }
    });
  }

  $('i.fas').on('click', (event) => {
    // アイコンクリック時に、親要素のtrにイベントが伝播しないようにする
    event.stopPropagation();
    // 停止された際に経過時間を送信する
    if ($(event.target).hasClass('fa-play')) {
      let taskId = event.target.id;
      let time = document.getElementById(`timer-${taskId}`).textContent;
      let data = { id: taskId, elapsed_time: time };

      set_csrfToken();

      $.ajax({
        url: 'tasks',
        type: 'PATCH',
        data: { task: data },
        dataType: 'html',
        error: function (data) {
          alert('errror');
        },
      });
    }
  });
});
