import { mkdir } from 'node:fs/promises';
import { expect, test as setup } from '@fixtures/base-fixtures';
import { loginUsers } from '@data/users';

const authDirectory = '.auth';

setup.beforeAll(async () => {
    // Thư mục .auth không được commit nên cần tạo lại trên môi trường CI.
    await mkdir(authDirectory, { recursive: true });
});

/**
 * Đăng nhập một lần cho mỗi vai trò và lưu storageState tương ứng.
 * Các project E2E sẽ tái sử dụng session thay vì đăng nhập lại trong từng test.
 */
for (const user of loginUsers) {
    setup(`Xác thực và lưu session cho ${user.role}`, async ({
        loginPage,
        page,
    }) => {
        await setup.step('Mở trang đăng nhập', async () => {
            await loginPage.goto();
            await expect(loginPage.form).toBeVisible();
        });

        await setup.step(`Điền credentials ${user.role}`, async () => {
            await loginPage.fillCredentials(user.email, user.password);
            await expect(loginPage.emailInput).toHaveValue(user.email);
            await expect(loginPage.passwordInput).toHaveValue(user.password);
        });

        await setup.step('Gửi form đăng nhập', async () => {
            const response = await loginPage.submit();
            expect(response.status()).toBe(200);
        });

        await setup.step('Xác nhận điều hướng về Dashboard', async () => {
            await expect(page).toHaveURL(user.expectedRoute);
        });

        await setup.step(`Lưu storageState ${user.role}`, async () => {
            await page.context().storageState({
                path: `${authDirectory}/${user.role}.json`,
            });
        });
    });
}
