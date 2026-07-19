import { expect, request as requestFactory, test as base } from '@playwright/test';
import { WorkNestAPI } from '@api/WorkNestAPI';
import { DashboardPage } from '@pages/DashboardPage';
import { EmployeesPage } from '@pages/EmployeesPage';
import { LeavePage } from '@pages/LeavePage';
import { LoginPage } from '@pages/LoginPage';
import { TasksPage } from '@pages/TasksPage';

/**
 * Định nghĩa các Page Object được khởi tạo tự động cho mỗi test.
 */
type WorkNestFixtures = {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    employeesPage: EmployeesPage;
    leavePage: LeavePage;
    tasksPage: TasksPage;
    apiClient: WorkNestAPI;
};

/**
 * Custom test fixture của WorkNest.
 * Mỗi Page Object sử dụng cùng Page instance của test hiện tại.
 */
export const test = base.extend<WorkNestFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page));
    },

    employeesPage: async ({ page }, use) => {
        await use(new EmployeesPage(page));
    },

    leavePage: async ({ page }, use) => {
        await use(new LeavePage(page));
    },

    tasksPage: async ({ page }, use) => {
        await use(new TasksPage(page));
    },

    apiClient: async ({}, use) => {
        const apiContext = await requestFactory.newContext({
            baseURL:
                process.env.BASE_URL ?? 'https://worknest-site.netlify.app',
        });

        try {
            await use(new WorkNestAPI(apiContext));
        } finally {
            await apiContext.dispose();
        }
    },
});

export { expect };
