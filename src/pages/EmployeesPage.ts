import { expect, type Locator, type Page, type Response } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Đại diện cho trang danh sách nhân viên của WorkNest.
 * Chứa các locator và thao tác dùng chung cho Employee Directory.
 */
export class EmployeesPage extends BasePage {
    readonly pageContainer: Locator;
    readonly pageTitle: Locator;
    readonly searchInput: Locator;
    readonly table: Locator;
    readonly rows: Locator;
    readonly pagination: Locator;
    readonly nextPageButton: Locator;
    readonly profileContainer: Locator;

    constructor(page: Page) {
        super(page, '/employees');

        this.pageContainer = page.getByTestId('employees-page');
        this.pageTitle = page.getByTestId('page-title');
        this.searchInput = page.getByTestId('employee-search');
        this.table = page.getByTestId('employee-table');
        this.rows = page.getByTestId(/^employee-row-/);
        this.pagination = page.getByTestId('employee-pagination');
        this.nextPageButton = page.getByTestId('next-page');
        this.profileContainer = page.getByTestId('employee-profile-page');
    }

    /**
     * Điều hướng tới Employee Directory và chờ danh sách sẵn sàng.
     */
    async goto(): Promise<void> {
        await this.navigate();
        await this.waitForElement(this.pageContainer);
        await expect(this.pageTitle).toHaveText('Employee Directory');
        await this.waitForTable();
    }

    /**
     * Chờ bảng và ít nhất một dòng nhân viên hiển thị.
     */
    async waitForTable(): Promise<void> {
        await this.waitForElement(this.table);
        await this.waitForElement(this.rows.first());
    }

    /**
     * Tìm kiếm nhân viên và chờ API trả về kết quả sau debounce.
     */
    async search(term: string): Promise<Response> {
        const searchResponse = this.page.waitForResponse((response) => {
            const requestUrl = new URL(response.url());

            return (
                requestUrl.pathname === '/api/employees' &&
                requestUrl.searchParams.get('search') === term &&
                response.request().method() === 'GET'
            );
        });

        await this.fillField(this.searchInput, term);

        return searchResponse;
    }

    /**
     * Mở profile từ link trong dòng nhân viên đầu tiên.
     */
    async clickFirstRow(): Promise<void> {
        const firstProfileLink = this.rows
            .first()
            .getByTestId(/^profile-link-/);

        await Promise.all([
            this.page.waitForURL(/\/employees\/u\d+/),
            this.clickElement(firstProfileLink),
        ]);
    }
}
