# WorkNest Playwright Test Suite

## Thông tin học viên

| Thông tin | Nội dung |
| --- | --- |
| Họ và tên | Võ Hoàng Hà |
| Mã số sinh viên | havh10007 |
| Lớp | PW0126 |
| Repository | https://github.com/goldenriver1592/worknest-playwright-havh10007-lite |

## Mô tả đồ án

Đây là bộ kiểm thử tự động cho WorkNest — cổng thông tin nội bộ mô phỏng hệ thống quản trị nhân sự của doanh nghiệp. Project sử dụng Playwright Test và TypeScript strict mode để kiểm thử các luồng E2E, API và Visual Regression trên ba vai trò Admin, Manager và Employee. Page Object Model, custom fixtures và storageState được áp dụng để tái sử dụng thao tác cũng như phiên đăng nhập. Allure là công cụ báo cáo chính, kết hợp với HTML report, screenshot, video và trace để hỗ trợ phân tích lỗi.

- Ứng dụng: [WorkNest](https://worknest-site.netlify.app/)
- Framework: Playwright Test
- Ngôn ngữ: TypeScript
- Báo cáo: Allure Report và Playwright HTML Report
- Tổng số test case bắt buộc: 20

## Phạm vi kiểm thử

| Loại | Số lượng | Test case |
| --- | ---: | --- |
| E2E | 12 | AUTH-01, AUTH-02, AUTH-04, DASH-01, DASH-02, EMP-01, EMP-02, EMP-05, LEAVE-01, LEAVE-04, TASK-01, TASK-04 |
| Data-driven | 3 | DD-AUTH cho Admin, Manager và Employee |
| API | 3 | API-01, API-02, API-04 |
| Visual | 2 | VIS-01, VIS-02 |

## Tài khoản kiểm thử

| Vai trò | Email | Mật khẩu |
| --- | --- | --- |
| Admin | `admin@worknest.com` | `admin123` |
| Manager | `manager@worknest.com` | `manager123` |
| Employee | `john@worknest.com` | `password123` |

Các tài khoản trên là demo accounts được WorkNest cung cấp cho mục đích kiểm thử.

## Yêu cầu môi trường

- Node.js 20 LTS trở lên.
- npm đi kèm Node.js.
- Java Runtime để generate và mở Allure Report.
- Chromium do Playwright quản lý.
- Kết nối Internet để truy cập môi trường WorkNest trên Netlify.

Các phiên bản dependency chính được khai báo trong `package.json`:

- `@playwright/test >= 1.48`
- `allure-playwright >= 3.0`
- `allure-js-commons >= 3.0`
- `allure-commandline`

## Cài đặt

Clone repository và chuyển vào thư mục project:

```bash
git clone https://github.com/goldenriver1592/worknest-playwright-havh10007-lite.git playwright-cw-prj
cd playwright-cw-prj
```

Cài dependency theo lockfile:

```bash
npm ci
```

Cài Chromium và system dependencies cần thiết:

```bash
npx playwright install --with-deps chromium
```

Kiểm tra TypeScript:

```bash
npm run typecheck
```

## Hướng dẫn chạy test

Chạy toàn bộ test suite:

```bash
npm test
```

Chạy E2E trên ba role projects:

```bash
npm run test:e2e
```

Chạy riêng API tests:

```bash
npm run test:api
```

Chạy Visual Regression tests:

```bash
npm run test:visual
```

Chạy theo tag:

```bash
npx playwright test --grep @smoke
npx playwright test --grep @regression
```

Chạy một test case cụ thể:

```bash
npx playwright test --grep "AUTH-01"
```

## Authentication và storageState

Project setup đăng nhập một lần cho từng vai trò và sinh các file:

```text
.auth/admin.json
.auth/manager.json
.auth/employee.json
```

Ba E2E projects tái sử dụng các file này nên không cần đăng nhập lại trong từng test. Thư mục `.auth/` chứa JWT và được loại khỏi Git bằng `.gitignore`. Trên máy mới hoặc CI, setup project sẽ tự tạo lại các storageState trước khi chạy project phụ thuộc.

## Visual Regression Testing

Visual tests chạy với viewport cố định `1440x900`, tắt animation và mask các vùng dữ liệu động. Hai baseline bắt buộc nằm tại:

```text
tests/visual/visual.spec.ts-snapshots/
├── login-page-visual-admin-chromium-linux.png
└── dashboard-admin-visual-admin-chromium-linux.png
```

Cập nhật baseline khi thay đổi giao diện đã được xác nhận là hợp lệ:

```bash
npm run test:update-snapshots
```

Không cập nhật snapshot chỉ để che giấu một visual regression chưa được phân tích.

## Allure Report

Sau khi chạy test, Allure results được sinh tại:

```text
reports/allure-results/
```

Generate báo cáo HTML:

```bash
npm run report:allure
```

Mở báo cáo đã generate:

```bash
npm run report:open
```

Allure report được lưu tại `reports/allure-report/`. Cấu hình categories dùng để phân loại Product Defects và Auto Test Defects nằm tại `reports/categories.json`.

## Playwright HTML Report

Sau khi chạy test, HTML report được sinh tại:

```text
reports/playwright-html/
```

Có thể mở trực tiếp bằng Playwright:

```bash
npx playwright show-report reports/playwright-html
```

## Cấu trúc project

```text
playwright-cw-prj/
├── .github/workflows/ci.yml
├── reports/categories.json
├── src/
│   ├── api/WorkNestAPI.ts
│   ├── data/
│   │   ├── leave-data.ts
│   │   ├── test-data.ts
│   │   ├── users.json
│   │   └── users.ts
│   ├── fixtures/base-fixtures.ts
│   ├── pages/
│   │   ├── BasePage.ts
│   │   ├── DashboardPage.ts
│   │   ├── EmployeesPage.ts
│   │   ├── LeavePage.ts
│   │   ├── LoginPage.ts
│   │   └── TasksPage.ts
│   ├── types/index.ts
│   └── utils/VisualCompare.ts
├── tests/
│   ├── api/api.spec.ts
│   ├── e2e/
│   │   ├── auth-data-driven.spec.ts
│   │   ├── auth.spec.ts
│   │   ├── dashboard.spec.ts
│   │   ├── employees.spec.ts
│   │   ├── leave.spec.ts
│   │   └── tasks.spec.ts
│   ├── setup/auth.setup.ts
│   └── visual/
│       ├── visual.spec.ts
│       └── visual.spec.ts-snapshots/
├── .gitignore
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

## Kết quả chạy cuối cùng

Kết quả lần chạy rà soát gần nhất trên source code hiện tại:

| Thời điểm | Passed | Failed | Skipped | Thời gian | Môi trường |
| --- | ---: | ---: | ---: | --- | --- |
| 19/07/2026 | 45 | 0 | 2 | 26 giây | Local — Chromium/Linux |

Lệnh dùng cho lần chạy final:

```bash
npx playwright test
```

## Allure Dashboard Screenshot

TBD — thêm ảnh Allure dashboard vào repository và nhúng tại đây:

```markdown
![Allure Report Dashboard](docs/images/allure-dashboard.png)
```

## CI/CD

GitHub Actions workflow tại `.github/workflows/ci.yml` thực hiện:

1. Cài Node.js và dependencies.
2. Cài Playwright Chromium.
3. Kiểm tra TypeScript strict mode.
4. Chạy toàn bộ test suite.
5. Generate Allure report.
6. Upload Playwright và Allure reports dưới dạng artifacts.

Link workflow run gần nhất: TBD

## Video demo

- Video demo 2–4 phút: TBD

Nội dung video đề xuất:

1. Giới thiệu cấu trúc project và Page Object Model.
2. Chạy toàn bộ test suite.
3. Mở Playwright HTML Report.
4. Generate và trình bày Allure Report.
5. Giải thích storageState, API helper và Visual baseline.

## Quy ước phát triển

- Ưu tiên `getByRole`, `getByLabel` và `getByTestId`.
- Mỗi test case được chia bằng `test.step()`.
- Không dùng `test.skip()` ngoại trừ điều kiện role được yêu cầu cho DASH-02.
- Không dùng `waitForTimeout()` nếu không có lý do kỹ thuật rõ ràng.
- Không commit `.auth/`, generated reports, `test-results/` hoặc `node_modules/`.
- Phải commit `reports/categories.json` và hai Visual baseline PNG.
- Commit message tuân theo Conventional Commits: `feat:`, `fix:`, `test:`, `docs:`.

## Trạng thái hoàn thiện

| Hạng mục | Trạng thái |
| --- | --- |
| 12 E2E test cases | Hoàn thành |
| 3 data-driven login tests | Hoàn thành |
| 3 API test cases | Hoàn thành |
| 2 Visual test cases | Hoàn thành |
| Visual baseline | Hoàn thành |
| Allure categories | Hoàn thành |
| CI workflow | Đã cấu hình, chờ xác minh trên GitHub |
| Kết quả local gần nhất | 45 passed, 2 skipped, 0 failed |
| Allure screenshot | TBD |
| Video demo | TBD |
