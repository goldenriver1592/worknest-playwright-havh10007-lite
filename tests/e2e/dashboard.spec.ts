import * as allure from 'allure-js-commons';
import { expect, test } from '@fixtures/base-fixtures';

test.describe('Module Dashboard', () => {
    test('DASH-01 @smoke: Dashboard hiển thị stat cards theo vai trò Admin', async ({
        dashboardPage,
        page,
    }) => {
        await allure.label('module', 'DASHBOARD');
        await allure.severity(allure.Severity.CRITICAL);
        await allure.tag('smoke');

        await test.step('Mở Dashboard qua storageState', async () => {
            await page.goto('/');
            await expect(page).toHaveURL('/');
        });

        await test.step('Đợi Dashboard load', async () => {
            await dashboardPage.waitForReady();
            await expect(dashboardPage.pageTitle).toHaveText('Dashboard');
        });

        await test.step('Assert có ít nhất 4 stat cards', async () => {
            await expect
                .poll(() => dashboardPage.statCards.count())
                .toBeGreaterThanOrEqual(4);
        });
    });

    test('DASH-02 @regression: Dashboard Employee chỉ hiện stats cá nhân', async ({
        dashboardPage,
        page,
    }, testInfo) => {
        test.skip(
            testInfo.project.name !== 'employee-chromium',
            'DASH-02 chỉ áp dụng cho role Employee',
        );

        await allure.label('module', 'DASHBOARD');
        await allure.severity(allure.Severity.NORMAL);
        await allure.tag('regression');

        await test.step('Mở Dashboard Employee qua storageState', async () => {
            await page.goto('/');
            await expect(page).toHaveURL('/');
        });

        await test.step('Đợi Dashboard load', async () => {
            await dashboardPage.waitForReady();
            await expect(dashboardPage.pageTitle).toHaveText('Dashboard');
        });

        await test.step('Assert My Approved Leaves hiển thị', async () => {
            await expect(
                dashboardPage.employeeApprovedLeavesCard,
            ).toBeVisible();
        });

        await test.step('Assert My Open Tasks hiển thị', async () => {
            await expect(dashboardPage.employeeOpenTasksCard).toBeVisible();
        });

        await test.step('Assert không hiện Total Employees', async () => {
            await expect(dashboardPage.totalEmployeesCard).toHaveCount(0);
        });
    });
});
