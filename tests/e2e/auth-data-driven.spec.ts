import * as allure from 'allure-js-commons';
import { loginUsers } from '@data/users';
import { expect, test } from '@fixtures/base-fixtures';

test.describe('DD-AUTH: Đăng nhập theo dữ liệu người dùng', () => {
    // Data-driven login phải bắt đầu bằng browser context chưa đăng nhập.
    test.use({ storageState: { cookies: [], origins: [] } });

    for (const user of loginUsers) {
        test(`DD-AUTH @regression: Đăng nhập với role ${user.role}`, async ({
            loginPage,
            page,
        }) => {
            await allure.label('module', 'AUTH');
            await allure.severity(allure.Severity.NORMAL);
            await allure.tag('regression');

            await test.step('Mở trang login', async () => {
                await loginPage.goto();
                await expect(loginPage.form).toBeVisible();
            });

            await test.step(`Điền credentials ${user.role}`, async () => {
                await loginPage.fillCredentials(user.email, user.password);
                await expect(loginPage.emailInput).toHaveValue(user.email);
                await expect(loginPage.passwordInput).toHaveValue(user.password);
            });

            await test.step('Click Submit', async () => {
                const response = await loginPage.submit();
                expect(response.status()).toBe(200);
            });

            await test.step('Assert điều hướng', async () => {
                await expect(page).toHaveURL(user.expectedRoute);
            });
        });
    }
});
