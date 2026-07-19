import * as allure from 'allure-js-commons';
import { expect, test } from '@fixtures/base-fixtures';

test.describe('Module Employees', () => {
    test('EMP-01 @smoke: Hiển thị danh sách nhân viên mặc định', async ({
        employeesPage,
        page,
    }) => {
        await allure.label('module', 'EMPLOYEES');
        await allure.severity(allure.Severity.CRITICAL);
        await allure.tag('smoke');

        await test.step('Mở phiên đăng nhập từ storageState', async () => {
            await page.goto('/');
            await expect(page).toHaveURL('/');
        });

        await test.step('Vào trang Employees', async () => {
            await employeesPage.goto();
            await expect(page).toHaveURL(/\/employees/);
            await expect(employeesPage.pageTitle).toHaveText(
                'Employee Directory',
            );
        });

        await test.step('Đợi bảng load', async () => {
            await employeesPage.waitForTable();
            await expect(employeesPage.table).toBeVisible();
        });

        await test.step('Assert có ít nhất 8 dòng', async () => {
            await expect
                .poll(() => employeesPage.rows.count())
                .toBeGreaterThanOrEqual(8);
        });
    });

    test('EMP-02 @regression: Tìm kiếm theo tên', async ({ employeesPage }) => {
        await allure.label('module', 'EMPLOYEES');
        await allure.severity(allure.Severity.NORMAL);
        await allure.tag('regression');

        await test.step('Vào trang Employees', async () => {
            await employeesPage.goto();
            await expect(employeesPage.table).toBeVisible();
        });

        await test.step('Gõ John vào ô search', async () => {
            const response = await employeesPage.search('John');
            expect(response.status()).toBe(200);
            expect(response.url()).toContain('search=John');
        });

        await test.step('Đợi kết quả', async () => {
            await employeesPage.waitForTable();
            await expect(employeesPage.rows.first()).toBeVisible();
        });

        await test.step('Assert mọi dòng có chứa John', async () => {
            await expect
                .poll(async () => {
                    const rowTexts = await employeesPage.rows.allTextContents();
                    return (
                        rowTexts.length > 0 &&
                        rowTexts.every((text) => /john/i.test(text))
                    );
                })
                .toBe(true);
        });
    });

    test('EMP-05 @regression: Xem profile nhân viên', async ({
        employeesPage,
        page,
    }) => {
        await allure.label('module', 'EMPLOYEES');
        await allure.severity(allure.Severity.NORMAL);
        await allure.tag('regression');

        await test.step('Vào trang Employees', async () => {
            await employeesPage.goto();
            await expect(employeesPage.table).toBeVisible();
        });

        await test.step('Click vào dòng đầu tiên', async () => {
            await employeesPage.clickFirstRow();
        });

        await test.step('Assert URL chứa employees/u', async () => {
            await expect(page).toHaveURL(/\/employees\/u\d+/);
        });

        await test.step('Assert profile chi tiết hiển thị', async () => {
            await expect(employeesPage.profileContainer).toBeVisible();
        });
    });
});
