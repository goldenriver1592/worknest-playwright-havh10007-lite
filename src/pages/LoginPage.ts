import {
    expect,
    type Locator,
    type Page,
    type Response,
} from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Đại diện cho trang đăng nhập của WorkNest.
 * Chứa các locator và thao tác dùng chung cho luồng xác thực.
 */
export class LoginPage extends BasePage {
    readonly pageContainer: Locator;
    readonly title: Locator;
    readonly form: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;
    readonly errorAlert: Locator;
    readonly demoAccounts: Locator;

    constructor(page: Page) {
        super(page, '/login');

        this.pageContainer = page.getByTestId('login-page');
        this.title = page.getByTestId('login-title');
        this.form = page.getByTestId('login-form');
        this.emailInput = page.getByTestId('login-email');
        this.passwordInput = page.getByTestId('login-password');
        this.submitButton = page.getByTestId('login-submit');
        this.errorAlert = page.getByTestId('login-error');
        this.demoAccounts = page.getByTestId('demo-accounts');
    }

    /**
     * Điều hướng tới trang đăng nhập và chờ form sẵn sàng.
     */
    async goto(): Promise<void> {
        await this.navigate();
        await this.waitForElement(this.form);
    }

    /**
     * Điền email và mật khẩu vào form đăng nhập.
     */
    async fillCredentials(email: string, password: string): Promise<void> {
        await this.fillField(this.emailInput, email);
        await this.fillField(this.passwordInput, password);
    }

    /**
     * Gửi form đăng nhập và trả về response của API xác thực.
     */
    async submit(): Promise<Response> {
        const loginResponse = this.page.waitForResponse(
            (response) =>
                response.url().includes('/api/auth/login') &&
                response.request().method() === 'POST',
        );

        await this.clickElement(this.submitButton);

        return loginResponse;
    }

    /**
     * Thực hiện đầy đủ thao tác đăng nhập bằng email và mật khẩu.
     */
    async login(email: string, password: string): Promise<Response> {
        await this.fillCredentials(email, password);
        return this.submit();
    }

    /**
     * Xác nhận thông báo lỗi đăng nhập được hiển thị đúng nội dung.
     */
    async expectError(message: string | RegExp): Promise<void> {
        await expect(this.errorAlert).toBeVisible();
        await expect(this.errorAlert).toContainText(message);
    }
}
