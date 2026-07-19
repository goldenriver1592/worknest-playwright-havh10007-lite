/**
 * Tạo chuỗi ngày theo định dạng YYYY-MM-DD cho input type="date".
 */
function formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
}

/**
 * Tạo khoảng ngày nghỉ hợp lệ trong tương lai.
 */
export function createFutureLeaveDates(): { start: string; end: string } {
    const startDate = new Date();
    startDate.setUTCDate(startDate.getUTCDate() + 14);

    const endDate = new Date(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + 2);

    return {
        start: formatDate(startDate),
        end: formatDate(endDate),
    };
}
