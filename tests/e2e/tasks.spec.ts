import * as allure from 'allure-js-commons';
import { expect, test } from '@fixtures/base-fixtures';

test.describe('Module Tasks', () => {
    test('TASK-01 @smoke: Bảng Kanban hiển thị 4 cột', async ({
        page,
        tasksPage,
    }) => {
        await allure.label('module', 'TASKS');
        await allure.severity(allure.Severity.CRITICAL);
        await allure.tag('smoke');

        await test.step('Mở phiên đăng nhập từ storageState', async () => {
            await page.goto('/');
            await expect(page).toHaveURL('/');
        });

        await test.step('Vào trang Tasks', async () => {
            await tasksPage.goto();
            await expect(page).toHaveURL(/\/tasks/);
            await expect(tasksPage.board).toBeVisible();
        });

        await test.step('Đợi board load', async () => {
            await tasksPage.waitForBoard();
            await expect(tasksPage.columns).toHaveCount(4);
        });

        await test.step('Assert 4 cột Kanban', async () => {
            await expect(tasksPage.todoColumn).toContainText('To Do');
            await expect(tasksPage.inProgressColumn).toContainText('In Progress');
            await expect(tasksPage.reviewColumn).toContainText('Review');
            await expect(tasksPage.doneColumn).toContainText('Done');
        });

        await test.step('Assert mỗi cột có count badge', async () => {
            await expect(tasksPage.countBadges).toHaveCount(4);
            await expect(page.getByTestId('count-todo')).toBeVisible();
            await expect(page.getByTestId('count-in-progress')).toBeVisible();
            await expect(page.getByTestId('count-review')).toBeVisible();
            await expect(page.getByTestId('count-done')).toBeVisible();
        });
    });

    test('TASK-04 @regression: Mở modal Create New Task', async ({ tasksPage }) => {
        await allure.label('module', 'TASKS');
        await allure.severity(allure.Severity.NORMAL);
        await allure.tag('regression');

        await test.step('Vào trang Tasks', async () => {
            await tasksPage.goto();
            await expect(tasksPage.board).toBeVisible();
        });

        await test.step('Click nút Add Task', async () => {
            await tasksPage.clickAddTask();
        });

        await test.step('Assert modal dialog hiển thị', async () => {
            await expect(tasksPage.dialog).toBeVisible();
            await expect(tasksPage.form).toBeVisible();
        });

        await test.step('Assert các trường form có đầy đủ', async () => {
            await tasksPage.expectFormFields();
        });
    });
});
