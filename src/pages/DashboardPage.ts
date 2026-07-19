import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Đại diện cho trang Dashboard của WorkNest.
 * Chứa các locator và thao tác dùng chung cho Dashboard theo từng vai trò.
 */
export class DashboardPage extends BasePage {
    // Thành phần dùng chung cho tất cả vai trò.
    readonly pageContainer: Locator;
    readonly pageTitle: Locator;
    readonly welcomeBanner: Locator;
    readonly statCardsContainer: Locator;
    readonly statCards: Locator;
    readonly logoutButton: Locator;

    // Thành phần dành cho Admin.
    readonly adminAuditLogsLink: Locator;
    readonly totalEmployeesCard: Locator;

    // Thành phần dành cho Employee.
    readonly employeeApprovedLeavesCard: Locator;
    readonly employeeOpenTasksCard: Locator;

    // Thành phần dùng để mask dữ liệu động trong Visual Testing.
    readonly statValues: Locator;
    readonly recentActivity: Locator;
    readonly upcomingMeetings: Locator;
    readonly myTasks: Locator;
    readonly notificationButton: Locator;

    constructor(page: Page) {
        super(page, '/');

        this.pageContainer = page.getByTestId('dashboard-page');
        this.pageTitle = page.getByTestId('page-title');
        this.welcomeBanner = page.getByTestId('welcome-banner');
        this.statCardsContainer = page.getByTestId('stat-cards');

        // WorkNest không cung cấp data-testid riêng cho từng stat card.
        this.statCards = this.statCardsContainer.locator('.stat-card');
        this.logoutButton = page.getByRole('button', { name: /logout/i });

        this.adminAuditLogsLink = page.getByRole('link', {
            name: 'Audit Logs',
            exact: true,
        });
        this.totalEmployeesCard = page.getByText('Total Employees', {
            exact: true,
        });

        this.employeeApprovedLeavesCard = page.getByText('My Approved Leaves', {
            exact: true,
        });
        this.employeeOpenTasksCard = page.getByText('My Open Tasks', {
            exact: true,
        });

        // WorkNest không cung cấp data-testid riêng cho từng stat value.
        this.statValues = this.statCardsContainer.locator('.stat-card-value');
        this.recentActivity = page.getByTestId('recent-activity');
        this.upcomingMeetings = page.getByTestId('upcoming-meetings');
        this.myTasks = page.getByTestId('my-tasks');
        this.notificationButton = page.getByTestId('notification-btn');
    }

    /**
     * Điều hướng tới Dashboard bằng trạng thái đăng nhập hiện tại.
     */
    async goto(): Promise<void> {
        await this.navigate();
        await this.waitForReady();
    }

    /**
     * Chờ Dashboard tải xong và sẵn sàng để tương tác.
     */
    async waitForReady(): Promise<void> {
        await this.waitForElement(this.pageContainer);
        await expect(this.pageTitle).toHaveText('Dashboard');
        await this.waitForElement(this.statCardsContainer);
    }

    /**
     * Đăng xuất và chờ ứng dụng điều hướng về trang đăng nhập.
     */
    async logout(): Promise<void> {
        await Promise.all([
            this.page.waitForURL(/\/login/),
            this.clickElement(this.logoutButton),
        ]);
    }
}
