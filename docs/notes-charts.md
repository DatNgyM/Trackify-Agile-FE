* BIểu đồ đường cột

""

 Để biểu đồ cột, biểu đồ đường và % tự cập nhật khi hoàn thành công việc thay đổi, nên dùng thư viện chart hỗ trợ data-driven và re-render khi props/state đổi. Gợi ý phù hợp với stack Next.js + React + TypeScript:

---

## 1. Recharts (nên dùng trước)

* npm: recharts
* Tại sao phù hợp: Viết cho React, nhận data qua props → khi data đổi (từ state, API, hoặc sau khi "hoàn thành công việc") component re-render và biểu đồ tự cập nhật.
* Dùng cho: Biểu đồ cột (BarChart, Bar), biểu đồ đường/vùng (LineChart / AreaChart), và phần % có thể là một số tính từ data (ví dụ completed / total * 100) rồi hiển thị bằng text hoặc PieChart/progress.
* Ưu điểm: API đơn giản, TypeScript tốt, tree-shake được, không cần DOM trực tiếp.
* Ví dụ ý tưởng:
* Bar: data={tasksByStatus} hoặc data={sprintProgress}.
* Line/Area: data={completionOverTime} (theo ngày/tuần).
* %: const percent = (completedCount / totalTasks) * 100 → khi task đổi trạng thái, percent đổi → UI đổi.

---

## 2. Chart.js + react-chartjs-2

* npm: chart.js + react-chartjs-2
* Tại sao phù hợp: Chart.js nhận data và options; React wrapper re-render khi props đổi, nên cũng "cập nhật khi hoàn thành công việc" nếu bạn truyền data từ state/API.
* Dùng cho: Bar, Line, và có thể dùng cho % (number hoặc doughnut/pie nhỏ).
* Ưu điểm: Rất phổ biến, nhiều loại chart, tùy biến mạnh.
* Nhược điểm: Bundle hơi nặng hơn Recharts nếu chỉ cần vài loại chart.

---

## 3. Tremor (built on top of Recharts)

* npm: @tremor/react
* Tại sao phù hợp: Component sẵn kiểu dashboard (KPI card, bar, line, area), nhận data qua props → thay đổi công việc → đổi data → chart và số % đều đổi theo.
* Dùng cho: Cả biểu đồ cột/đường và ô hiển thị % (KPI) trong cùng một hệ design.
* Ưu điểm: Giao diện đẹp sẵn, ít code, phù hợp dashboard.

---

## 4. Giữ SVG tự viết nhưng "đưa data vào"

* Không cần extension: chỉ cần truyền data vào component (ví dụ tasksByDay, completionRate) và tính:
* Bar: values từ số task hoàn thành theo ngày/sprint.
* Line/Area: points từ tiến độ theo thời gian.
* %: (completed / total) * 100.
* Khi state/API đổi → props đổi → component re-render → biểu đồ và % thay đổi. Cách này vẫn "có sự thay đổi khi hoàn thành công việc" nếu bạn gắn đúng nguồn data (context/API).

---

## Gợi ý cho Issue Tracker / Agile

* Recharts hoặc Tremor là lựa chọn cân bằng nhất: dễ đưa data từ "hoàn thành công việc" (task completed, sprint progress) vào và để biểu đồ + % tự cập nhật.
* Luồng chung:

1. Có nguồn dữ liệu: API hoặc state (danh sách task, trạng thái completed, theo ngày/sprint).
2. Tính: tasksCompleted, tasksByStatus, completionOverTime, percent = (completed/total)*100.
3. Truyền vào component chart và ô %; mỗi lần data đổi (sau khi cập nhật task/sprint), React re-render → biểu đồ và % thay đổi.
