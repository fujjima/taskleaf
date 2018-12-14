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

  // 削除されたタスクを非表示にする
  document.querySelectorAll('.delete').forEach(function (a) {
    a.addEventListener('ajax:success', function () {
      var td = a.parentNode;
      var tr = td.parentNode;
      tr.style.display = 'none';
    });
  });
});