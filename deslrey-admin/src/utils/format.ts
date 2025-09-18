/**
 * 把字节大小转换成人类可读的格式
 * @param bytes 字节大小
 * @param decimals 保留小数位数（默认 2）
 */
export function formatFileSize(bytes: number, decimals = 2): string {
    if (bytes === 0) return "0 B";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
