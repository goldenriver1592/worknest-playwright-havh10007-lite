import * as allure from 'allure-js-commons';
import { expect, test } from '@fixtures/base-fixtures';

test.describe('Module Authentication', () => {
    test.describe('Luồng đăng nhập không sử dụng storageState', () => {
        test.use({ storageState: { cookies: [], origins: [] } });

        test('AUTH-01 @smoke: Đăng nhập thành công với Admin', async ({
            dashboardPage,
            loginPage,
            page,
        }) => {
            await allure.label('module', 'AUTH');
            await allure.severity(allure.Severity.CRITICAL);
            await allure.tag('smoke');

            await test.step('Mở trang login', async () => {
                await loginPage.goto();
                await expect(page).toHaveURL(/\/login/);
                await expect(loginPage.form).toBeVisible();
            });

            await test.step('Điền credentials Admin', async () => {
                await loginPage.fillCredentials(
                    'admin@worknest.com',
                    'admin123',
                );
                await expect(loginPage.emailInput).toHaveValue(
                    'admin@worknest.com',
                );
                await expect(loginPage.passwordInput).toHaveValue('admin123');
            });

            await test.step('Click Submit', async () => {
                const response = await loginPage.submit();
                expect(response.status()).toBe(200);
            });

            await test.step('Assert điều hướng về Dashboard', async () => {
                await expect(page).toHaveURL('/');
            });

            await test.step('Assert sidebar Admin', async () => {
                await expect(dashboardPage.adminAuditLogsLink).toBeVisible();
            });
        });

        test('AUTH-02 @regression: Đăng nhập thất bại với sai mật khẩu', async ({
            loginPage,
            page,
        }) => {
            await allure.label('module', 'AUTH');
            await allure.severity(allure.Severity.CRITICAL);
            await allure.tag('regression');

            await test.step('Mở trang login', async () => {
                await loginPage.goto();
                await expect(loginPage.form).toBeVisible();
            });

            await test.step('Điền email đúng và password sai', async () => {
                await loginPage.fillCredentials(
                    'admin@worknest.com',
                    'sai_password',
                );
                await expect(loginPage.emailInput).toHaveValue(
                    'admin@worknest.com',
                );
                await expect(loginPage.passwordInput).toHaveValue('sai_password');
            });

            await test.step('Click Submit', async () => {
                const response = await loginPage.submit();
                expect(response.status()).toBe(401);
            });

            await test.step('Assert alert lỗi hiển thị', async () => {
                await loginPage.expectError(/invalid/i);
            });

            await test.step('Assert vẫn ở trang login', async () => {
                await expect(page).toHaveURL(/\/login/);
            });
        });
    });

    test('AUTH-04 @smoke: Đăng xuất khỏi hệ thống', async ({
        dashboardPage,
        page,
    }) => {
        await allure.label('module', 'AUTH');
        await allure.severity(allure.Severity.CRITICAL);
        await allure.tag('smoke');

        await test.step('Vào Dashboard bằng storageState', async () => {
            await dashboardPage.goto();
            await expect(page).toHaveURL('/');
        });

        await test.step('Click nút Logout', async () => {
            await dashboardPage.logout();
        });

        await test.step('Assert điều hướng về login', async () => {
            await expect(page).toHaveURL(/\/login/);
        });

        await test.step('Assert localStorage đã clear', async () => {
            const token = await page.evaluate(() =>
                localStorage.getItem('worknest_token'),
            );
            expect(token).toBeNull();
        });
    });
});
