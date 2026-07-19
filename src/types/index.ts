/**
 * Các vai trò được WorkNest hỗ trợ.
 */
export type UserRole = 'admin' | 'manager' | 'employee';

/**
 * Cấu trúc dữ liệu đăng nhập của người dùng.
 */
export interface LoginUser {
    role: UserRole;
    email: string;
    password: string;
    expectedRoute: string;
}

/**
 * Dữ liệu dùng để tạo một yêu cầu nghỉ phép.
 */
export interface LeaveRequestForm {
    type: 'annual' | 'sick' | 'personal' | 'remote';
    start: string;
    end: string;
    reason: string;
}

/**
 * Envelope thành công dùng chung của WorkNest API.
 */
export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
    message?: string;
}

/**
 * Envelope lỗi dùng chung của WorkNest API.
 */
export interface ApiErrorResponse {
    success: false;
    error: string;
    message?: string;
}

/**
 * Thông tin người dùng tối thiểu trả về từ API xác thực.
 */
export interface ApiUser {
    id: string;
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
}

/**
 * Payload trả về sau khi đăng nhập thành công.
 */
export interface AuthData {
    token: string;
    user: ApiUser;
}

/**
 * Thông tin nhân viên tối thiểu trả về từ Employees API.
 */
export interface EmployeeData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

/**
 * Envelope phân trang của Employees API.
 */
export interface EmployeesResponse extends ApiSuccessResponse<EmployeeData[]> {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
