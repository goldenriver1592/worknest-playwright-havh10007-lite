import usersJson from './users.json';
import type { LoginUser } from '../types';

/**
 * Danh sách người dùng đăng nhập được đọc từ users.json.
 */
export const loginUsers = usersJson as LoginUser[];
