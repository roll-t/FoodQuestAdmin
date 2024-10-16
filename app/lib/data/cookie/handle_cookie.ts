class HandleCookie {
    private key: string;
    private value: string;
    private days: number;

    constructor(key: string, value: string, days: number) {
        this.key = key;
        this.value = value;
        this.days = days;
    }

    /**
     * Lưu cookie với giá trị và thời gian hết hạn
     */
    setCookie() {
        if (typeof document !== 'undefined') {
            let expires = "";
            if (this.days) {
                const date = new Date();
                date.setTime(date.getTime() + (this.days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = this.key + "=" + (this.value || "") + expires + "; path=/";
        }
    }

    /**
     * Lấy giá trị của cookie theo tên
     * @returns Giá trị của cookie nếu tồn tại, ngược lại trả về chuỗi rỗng
     */
    static getCookie(key: string): string {
        if (typeof document !== 'undefined') {
            const nameEQ = key + "=";
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
        }
        return "";
    }

    /**
     * Xóa cookie
     */
    static deleteCookie(key: string) {
        if (typeof document !== 'undefined') {
            document.cookie = key + '=; Max-Age=-99999999; path=/';
        }
    }
}

export default HandleCookie;
