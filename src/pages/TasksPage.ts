import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Đại diện cho trang quản lý công việc của WorkNest.
 * Chứa các locator và thao tác dùng chung cho bảng Kanban.
 */
export class TasksPage extends BasePage {
    readonly pageContainer: Locator;
    readonly pageTitle: Locator;
    readonly board: Locator;
    readonly columns: Locator;
    readonly countBadges: Locator;
    readonly todoColumn: Locator;
    readonly inProgressColumn: Locator;
    readonly reviewColumn: Locator;
    readonly doneColumn: Locator;
    readonly addTaskButton: Locator;
    readonly dialog: Locator;
    readonly form: Locator;
    readonly titleInput: Locator;
    readonly descriptionInput: Locator;
    readonly assigneeSelect: Locator;
    readonly prioritySelect: Locator;
    readonly statusSelect: Locator;
    readonly dueDateInput: Locator;
    readonly tagsInput: Locator;

    constructor(page: Page) {
        super(page, '/tasks');

        this.pageContainer = page.getByTestId('tasks-page');
        this.pageTitle = page.getByTestId('page-title');
        this.board = page.getByTestId('kanban-board');
        this.columns = this.board.getByTestId(/^column-/);
        this.countBadges = this.board.getByTestId(/^count-/);
        this.todoColumn = page.getByTestId('column-todo');
        this.inProgressColumn = page.getByTestId('column-in-progress');
        this.reviewColumn = page.getByTestId('column-review');
        this.doneColumn = page.getByTestId('column-done');
        this.addTaskButton = page.getByTestId('add-task-btn');
        this.dialog = page.getByRole('dialog', { name: 'Create New Task' });
        this.form = page.getByTestId('task-form');
        this.titleInput = page.getByTestId('task-title');
        this.descriptionInput = page.getByTestId('task-description');
        this.assigneeSelect = page.getByTestId('task-assignee');
        this.prioritySelect = page.getByTestId('task-priority');
        this.statusSelect = page.getByTestId('task-status');
        this.dueDateInput = page.getByTestId('task-due-date');
        this.tagsInput = page.getByTestId('task-tags');
    }

    /**
     * Điều hướng tới trang Tasks và chờ bảng Kanban sẵn sàng.
     */
    async goto(): Promise<void> {
        await this.navigate();
        await this.waitForElement(this.pageContainer);
        await expect(this.pageTitle).toHaveText('Task Board');
        await this.waitForBoard();
    }

    /**
     * Chờ bảng Kanban và các cột được render.
     */
    async waitForBoard(): Promise<void> {
        await this.waitForElement(this.board);
        await this.waitForElement(this.columns.first());
    }

    /**
     * Mở modal Create New Task và chờ animation hoàn tất.
     */
    async clickAddTask(): Promise<void> {
        await this.clickElement(this.addTaskButton);
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
     * Xác nhận đầy đủ các trường của form Create New Task.
     */
    async expectFormFields(): Promise<void> {
        await expect(this.titleInput).toBeVisible();
        await expect(this.descriptionInput).toBeVisible();

        // CustomSelect sử dụng native select ẩn để lưu giá trị controlled.
        await expect(this.assigneeSelect).toBeAttached();
        await expect(this.prioritySelect).toBeAttached();
        await expect(this.statusSelect).toBeAttached();

        await expect(this.dueDateInput).toBeVisible();
        await expect(this.tagsInput).toBeVisible();
    }
}
