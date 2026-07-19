import { type Locator, type Page } from '@playwright/test';

/**
 * Cung cấp các thao tác dùng chung cho Page Object.
 */
export abstract class BasePage {
    constructor(
        protected readonly page: Page,
        protected readonly path: string,
    ) {}

    /**
     * Điều hướng đến đường dẫn của Page Object.
     */
    async navigate(): Promise<void> {
        await this.page.goto(this.path, {
            waitUntil: 'domcontentloaded',
        });
    }

    /**
     * Click vào phần tử.
     */
    async clickElement(locator: Locator): Promise<void> {
        await locator.click();
    }

    /**
     * Điền giá trị vào input.
     */
    async fillField(locator: Locator, value: string): Promise<void> {
        await locator.fill(value);
    }

    /**
     * Chọn option của native HTML select.
     */
    async selectNativeOption(
        locator: Locator,
        value: string,
    ): Promise<void> {
        await locator.selectOption(value);
    }

    /**
     * Đánh dấu checkbox.
     */
    async checkCheckbox(locator: Locator): Promise<void> {
        await locator.check();
    }

    /**
     * Bỏ đánh dấu checkbox.
     */
    async uncheckCheckbox(locator: Locator): Promise<void> {
        await locator.uncheck();
    }

    /**
     * Lấy nội dung hiển thị của phần tử.
     */
    async getElementText(locator: Locator): Promise<string> {
        return locator.innerText();
    }

    /**
     * Kiểm tra tức thời phần tử có hiển thị hay không.
     */
    async isElementVisible(locator: Locator): Promise<boolean> {
        return locator.isVisible();
    }

    /**
     * Chờ phần tử hiển thị.
     */
    async waitForElement(
        locator: Locator,
        timeout = 5_000,
    ): Promise<void> {
        await locator.waitFor({
            state: 'visible',
            timeout,
        });
    }

    /**
     * Lấy title của trang hiện tại.
     */
    async getPageTitle(): Promise<string> {
        return this.page.title();
    }
}