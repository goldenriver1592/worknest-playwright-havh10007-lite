import * as allure from 'allure-js-commons';
import type { Locator } from '@playwright/test';
import { expect, test } from '@fixtures/base-fixtures';
import { visualCompareOptions } from '@utils/VisualCompare';

test.describe('Visual Regression', () => {
    test('VIS-01 @regression: Visual snapshot trang Login', async ({
        loginPage,
        page,
    }) => {
        await allure.label('module', 'VISUAL');
        await allure.severity(allure.Severity.NORMAL);
        await allure.tag('regression');

        await test.step('Mở trang login chưa xác thực', async () => {
            // Visual project dùng Admin storageState nên cần xóa session trước.
            await page.goto('/login');
            await page.evaluate(() => {
                localStorage.removeItem('worknest_token');
                localStorage.removeItem('worknest_user');
            });

            await loginPage.goto();
            await expect(loginPage.form).toBeVisible();
        });

        await test.step('Đợi trang load hoàn tất', async () => {
            await page.waitForLoadState('networkidle');
            await page.evaluate(async () => {
                await document.fonts.ready;
            });
        });

        await test.step('Xác nhận trang không có dữ liệu động cần mask', async () => {
            await expect(loginPage.pageContainer).toBeVisible();
            await expect(loginPage.errorAlert).toHaveCount(0);
        });

        await test.step('Chụp và so sánh trang Login', async () => {
            await expect(page).toHaveScreenshot(
                'login-page.png',
                visualCompareOptions,
            );
        });
    });

    test('VIS-02 @regression: Visual snapshot Dashboard Admin', async ({
        dashboardPage,
        page,
    }) => {
        await allure.label('module', 'VISUAL');
        await allure.severity(allure.Severity.NORMAL);
        await allure.tag('regression');

        let dynamicMasks: Locator[] = [];

        await test.step('Mở Dashboard Admin qua storageState', async () => {
            await dashboardPage.goto();
            await expect(page).toHaveURL('/');
        });

        await test.step('Đợi Dashboard load hoàn tất', async () => {
            await page.waitForLoadState('networkidle');
            await page.evaluate(async () => {
                await document.fonts.ready;
            });
            await dashboardPage.waitForReady();
        });

        await test.step('Mask dữ liệu động trên Dashboard', async () => {
            dynamicMasks = [
                dashboardPage.statValues,
                dashboardPage.recentActivity,
                dashboardPage.upcomingMeetings,
                dashboardPage.myTasks,
                dashboardPage.notificationButton,
            ];

            await expect(dashboardPage.statValues.first()).toBeVisible();
            await expect(dashboardPage.recentActivity).toBeVisible();
        });

        await test.step('Chụp và so sánh Dashboard Admin', async () => {
            await expect(page).toHaveScreenshot('dashboard-admin.png', {
                ...visualCompareOptions,
                mask: dynamicMasks,
            });
        });
    });
});
