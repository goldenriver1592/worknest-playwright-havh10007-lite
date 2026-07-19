import * as allure from 'allure-js-commons';
import type { APIResponse } from '@playwright/test';
import { expect, test } from '@fixtures/base-fixtures';
import type {
    ApiErrorResponse,
    ApiSuccessResponse,
    AuthData,
    EmployeesResponse,
} from '../../src/types';

test.describe('WorkNest API', () => {
    test('API-01 @smoke: Login Admin trả về JWT', async ({ apiClient }) => {
        await allure.label('module', 'API');
        await allure.severity(allure.Severity.CRITICAL);
        await allure.tag('smoke');

        let response!: APIResponse;
        let body!: ApiSuccessResponse<AuthData>;

        await test.step('Tạo request context mới', async () => {
            expect(apiClient).toBeTruthy();
        });

        await test.step('Gửi POST api/auth/login', async () => {
            response = await apiClient.login(
                'admin@worknest.com',
                'admin123',
            );
        });

        await test.step('Assert status bằng 200', async () => {
            expect(response.status()).toBe(200);
        });

        await test.step('Assert có token', async () => {
            body = await apiClient.readBody<ApiSuccessResponse<AuthData>>(response);
            expect(body.success).toBe(true);
            expect(body.data.token).toEqual(expect.any(String));
            expect(body.data.token.length).toBeGreaterThan(0);
        });

        await test.step('Assert user role là admin', async () => {
            expect(body.data.user.role).toBe('admin');
        });
    });

    test('API-02 @regression: Auth me không token trả về 401', async ({
        apiClient,
    }) => {
        await allure.label('module', 'API');
        await allure.severity(allure.Severity.CRITICAL);
        await allure.tag('regression');

        let response!: APIResponse;

        await test.step('Tạo request context không auth', async () => {
            expect(apiClient).toBeTruthy();
        });

        await test.step('Gửi GET api/auth/me không header', async () => {
            response = await apiClient.getCurrentUser();
        });

        await test.step('Assert status bằng 401', async () => {
            expect(response.status()).toBe(401);
        });

        await test.step('Assert body có message lỗi', async () => {
            const body = await apiClient.readBody<ApiErrorResponse>(response);
            expect(body.success).toBe(false);
            expect(body.error).toMatch(/unauthorized|token|auth/i);
        });
    });

    test('API-04 @regression: Employees trả về danh sách nhân viên', async ({
        apiClient,
    }) => {
        await allure.label('module', 'API');
        await allure.severity(allure.Severity.CRITICAL);
        await allure.tag('regression');

        let token = '';
        let response!: APIResponse;

        await test.step('Login Admin lấy token', async () => {
            token = await apiClient.loginAdmin();
            expect(token.length).toBeGreaterThan(0);
        });

        await test.step('Gửi GET api/employees page 1 limit 8', async () => {
            response = await apiClient.getEmployees(token, 1, 8);
        });

        await test.step('Assert status bằng 200', async () => {
            expect(response.status()).toBe(200);
        });

        await test.step('Assert data là mảng', async () => {
            const body = await apiClient.readBody<EmployeesResponse>(response);
            expect(body.success).toBe(true);
            expect(Array.isArray(body.data)).toBe(true);
        });

        await test.step('Assert danh sách có ít nhất 8 nhân viên', async () => {
            const body = await apiClient.readBody<EmployeesResponse>(response);
            expect(body.data.length).toBeGreaterThanOrEqual(8);
            expect(body.page).toBe(1);
            expect(body.limit).toBe(8);
        });
    });
});
