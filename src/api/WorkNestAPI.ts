import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { ApiSuccessResponse, AuthData } from '../types';

/**
 * Cung cấp các thao tác dùng chung với WorkNest API.
 */
export class WorkNestAPI {
    constructor(private readonly context: APIRequestContext) {}

    /**
     * Gửi request đăng nhập bằng email và mật khẩu.
     */
    async login(email: string, password: string): Promise<APIResponse> {
        return this.context.post('/api/auth/login', {
            data: { email, password },
        });
    }

    /**
     * Lấy thông tin người dùng hiện tại, có hoặc không có token.
     */
    async getCurrentUser(token?: string): Promise<APIResponse> {
        return this.context.get('/api/auth/me', {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
    }

    /**
     * Lấy danh sách nhân viên theo trang và giới hạn chỉ định.
     */
    async getEmployees(
        token: string,
        page = 1,
        limit = 8,
    ): Promise<APIResponse> {
        return this.context.get('/api/employees', {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, limit },
        });
    }

    /**
     * Đọc JSON response theo kiểu dữ liệu mong đợi.
     */
    async readBody<T>(response: APIResponse): Promise<T> {
        return response.json() as Promise<T>;
    }

    /**
     * Đăng nhập Admin và trả về JWT dùng cho các request cần xác thực.
     */
    async loginAdmin(): Promise<string> {
        const response = await this.login('admin@worknest.com', 'admin123');
        const body = await this.readBody<ApiSuccessResponse<AuthData>>(response);

        if (!response.ok() || !body.success || !body.data.token) {
            throw new Error('Không thể lấy Admin token từ WorkNest API');
        }

        return body.data.token;
    }
}
