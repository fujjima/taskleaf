json.reports do
  # [{recorded_at: "2021-01-31", テストタスク2: 6, テストタスク1: 25}]の中身をキャメルケースにする
  json.array! @report_datas
end
