class DateUtils {
    // Phương thức để chuyển đổi thời gian UTC sang giờ Việt Nam và chỉ hiển thị ngày
    static convertUtcToVietnamDate(utcTime: string): string {
        const date = new Date(utcTime);
        const options: Intl.DateTimeFormatOptions = {
            timeZone: 'Asia/Bangkok',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        };
        // Chuyển đổi sang định dạng ngày theo dd/mm/yyyy
        return date.toLocaleDateString('vi-VN', options);
    }
}
export default DateUtils