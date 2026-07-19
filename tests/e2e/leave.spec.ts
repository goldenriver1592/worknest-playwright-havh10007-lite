import * as allure from 'allure-js-commons';
import { createFutureLeaveDates } from '@data/leave-data';
import { expect, test } from '@fixtures/base-fixtures';

test.describe('Module Leave', () => {
    test('LEAVE-01 @smoke: Hiển thị số dư nghỉ phép', async ({
        leavePage,
        page,
    }) => {
        await allure.label('module', 'LEAVE');
        await allure.severity(allure.Severity.CRITICAL);
        await allure.tag('smoke');

        await test.step('Mở phiên Employee từ storageState', async () => {
            await page.goto('/');
            await expect(page).toHaveURL('/');
        });

        await test.step('Vào trang Leave', async () => {
            await leavePage.goto();
            await expect(page).toHaveURL(/\/leave/);
            await expect(leavePage.pageTitle).toHaveText('Leave Management');
        });

        await test.step('Đợi balance load', async () => {
            await leavePage.waitForBalance();
            await expect(leavePage.balanceContainer).toBeVisible();
        });

        await test.step('Assert có 4 thẻ balance', async () => {
            await expect(leavePage.balanceCards).toHaveCount(4);
        });
    });

    test('LEAVE-04 @regression: Submit form thành công', async ({ leavePage }) => {
        await allure.label('module', 'LEAVE');
        await allure.severity(allure.Severity.CRITICAL);
        await allure.tag('regression');

        const dates = createFutureLeaveDates();
        const leaveRequest = {
            type: 'annual' as const,
            start: dates.start,
            end: dates.end,
            reason: 'Test reason',
        };

        await test.step('Vào trang Leave và mở modal', async () => {
            await leavePage.goto();
            await leavePage.openNewRequestModal();
            await expect(leavePage.dialog).toBeVisible();
        });

        await test.step('Điền form đầy đủ', async () => {
            await leavePage.fillForm(leaveRequest);
            await expect(leavePage.typeSelect).toHaveValue(leaveRequest.type);
            await expect(leavePage.startDateInput).toHaveValue(leaveRequest.start);
            await expect(leavePage.endDateInput).toHaveValue(leaveRequest.end);
            await expect(leavePage.reasonInput).toHaveValue(leaveRequest.reason);
        });

        await test.step('Click Submit', async () => {
            const response = await leavePage.submit();
            expect(response.status()).toBe(201);
        });

        await test.step('Assert toast thành công', async () => {
            await expect(leavePage.toastSuccess).toBeVisible();
            await expect(leavePage.toastSuccess).toContainText(
                'Leave request submitted',
            );
        });
    });
});
