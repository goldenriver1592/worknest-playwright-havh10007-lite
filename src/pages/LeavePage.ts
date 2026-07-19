import { expect, type Locator, type Page, type Response } from '@playwright/test';
import type { LeaveRequestForm } from '../types';
import { BasePage } from './BasePage';

/**
 * Đại diện cho trang quản lý nghỉ phép của WorkNest.
 * Chứa các locator và thao tác dùng chung cho Leave Management.
 */
export class LeavePage extends BasePage {
    readonly pageContainer: Locator;
    readonly pageTitle: Locator;
    readonly balanceContainer: Locator;
    readonly balanceCards: Locator;
    readonly newRequestButton: Locator;
    readonly dialog: Locator;
    readonly form: Locator;
    readonly typeSelect: Locator;
    readonly startDateInput: Locator;
    readonly endDateInput: Locator;
    readonly reasonInput: Locator;
    readonly submitButton: Locator;
    readonly toastSuccess: Locator;

    constructor(page: Page) {
        super(page, '/leave');

        this.pageContainer = page.getByTestId('leave-page');
        this.pageTitle = page.getByTestId('page-title');
        this.balanceContainer = page.getByTestId('leave-balance');

        // WorkNest không cung cấp data-testid riêng cho từng balance card.
        this.balanceCards = this.balanceContainer.locator('.stat-card');

        this.newRequestButton = page.getByTestId('new-leave-btn');
        this.dialog = page.getByRole('dialog', { name: 'New Leave Request' });
        this.form = page.getByTestId('leave-form');
        this.typeSelect = page.getByTestId('leave-type');
        this.startDateInput = page.getByTestId('leave-start');
        this.endDateInput = page.getByTestId('leave-end');
        this.reasonInput = page.getByTestId('leave-reason');
        this.submitButton = page.getByTestId('submit-leave');
        this.toastSuccess = page.getByTestId('toast-success');
    }

    /**
     * Điều hướng tới Leave Management và chờ số dư nghỉ phép hiển thị.
     */
    async goto(): Promise<void> {
        await this.navigate();
        await this.waitForElement(this.pageContainer);
        await expect(this.pageTitle).toHaveText('Leave Management');
        await this.waitForBalance();
    }

    /**
     * Chờ khu vực Leave Balance sẵn sàng.
     */
    async waitForBalance(): Promise<void> {
        await this.waitForElement(this.balanceContainer);
        await this.waitForElement(this.balanceCards.first());
    }

    /**
     * Mở modal tạo yêu cầu và chờ animation hoàn tất.
     */
    async openNewRequestModal(): Promise<void> {
        await this.clickElement(this.newRequestButton);
        await this.waitForElement(this.dialog);

        // Chờ CSS animation thực tế thay vì dùng waitForTimeout cố định.
        await this.dialog.evaluate(async (element) => {
            const animations = element.getAnimations();
            await Promise.all(
                animations.map((animation) => animation.finished.catch(() => undefined)),
            );
        });
    }

    /**
     * Cập nhật controlled CustomSelect bằng native setter và change event.
     */
    private async setControlledSelectValue(value: string): Promise<void> {
        await this.typeSelect.evaluate((selectElement, selectedValue) => {
            const valueSetter = Object.getOwnPropertyDescriptor(
                HTMLSelectElement.prototype,
                'value',
            )?.set;

            if (!valueSetter) {
                throw new Error('Không tìm thấy native value setter của select');
            }

            valueSetter.call(selectElement, selectedValue);
            selectElement.dispatchEvent(new Event('change', { bubbles: true }));
        }, value);
    }

    /**
     * Điền đầy đủ dữ liệu vào form tạo yêu cầu nghỉ phép.
     */
    async fillForm(data: LeaveRequestForm): Promise<void> {
        await this.setControlledSelectValue(data.type);
        await this.fillField(this.startDateInput, data.start);
        await this.fillField(this.endDateInput, data.end);
        await this.fillField(this.reasonInput, data.reason);
    }

    /**
     * Gửi form và trả về response của API tạo yêu cầu nghỉ phép.
     */
    async submit(): Promise<Response> {
        const leaveResponse = this.page.waitForResponse((response) => {
            const requestUrl = new URL(response.url());

            return (
                requestUrl.pathname === '/api/leave' &&
                response.request().method() === 'POST'
            );
        });

        await this.clickElement(this.submitButton);

        return leaveResponse;
    }
}
