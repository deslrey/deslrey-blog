package org.deslrey.util;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.text.DecimalFormat;
import java.util.Objects;

/**
 * 图片相关操作工具类
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/16 16:50
 */
public class ImageUtils {

    /**
     * 获取文件大小（字节数）
     *
     * @param file 文件对象
     * @return 文件大小（字节）
     */
    public static long getFileSize(File file) {
        if (file == null || !file.exists()) {
            return 0L;
        }
        return file.length();
    }

    /**
     * 获取格式化后的文件大小（带单位，KB/MB）
     *
     * @param file 文件对象
     * @return 格式化的文件大小字符串
     */
    public static String getFormatFileSize(File file) {
        long size = getFileSize(file);
        if (size <= 0) {
            return "0 B";
        }
        String[] units = new String[]{"B", "KB", "MB", "GB"};
        int unitIndex = (int) (Math.log10(size) / Math.log10(1024));
        double formattedSize = size / Math.pow(1024, unitIndex);
        return new DecimalFormat("#.##").format(formattedSize) + " " + units[unitIndex];
    }

    /**
     * 获取文件名（包含扩展名）
     *
     * @param file 文件对象
     * @return 文件名
     */
    public static String getFileName(File file) {
        if (file == null) {
            return null;
        }
        return file.getName();
    }

    /**
     * 获取文件名（不带扩展名）
     *
     * @param file 文件对象
     * @return 文件名（不含扩展名）
     */
    public static String getFileNameWithoutExt(File file) {
        if (file == null) {
            return null;
        }
        String fileName = file.getName();
        int dotIndex = fileName.lastIndexOf('.');
        return (dotIndex > 0) ? fileName.substring(0, dotIndex) : fileName;
    }

    /**
     * 获取文件扩展名
     *
     * @param file 文件对象
     * @return 扩展名（不含点），若无扩展名返回空字符串
     */
    public static String getFileExtension(File file) {
        if (file == null) {
            return "";
        }
        String fileName = file.getName();
        int dotIndex = fileName.lastIndexOf('.');
        return (dotIndex > 0) ? fileName.substring(dotIndex + 1).toLowerCase() : "";
    }

    /**
     * 获取文件 MIME 类型
     *
     * @param file 文件对象
     * @return MIME 类型，如 "image/png"
     */
    public static String getMimeType(File file) {
        if (file == null || !file.exists()) {
            return null;
        }
        try {
            return Files.probeContentType(file.toPath());
        } catch (IOException e) {
            return null;
        }
    }

    /**
     * 获取文件的绝对路径
     *
     * @param file 文件对象
     * @return 文件绝对路径
     */
    public static String getAbsolutePath(File file) {
        if (file == null) {
            return null;
        }
        return file.getAbsolutePath();
    }

    /**
     * 保存 MultipartFile 到指定文件夹
     *
     * @param multipartFile 上传的文件
     * @param folderPath    保存的文件夹路径
     * @return 保存后的文件对象
     * @throws IOException 保存失败时抛出异常
     */
    public static File saveMultipartFile(MultipartFile multipartFile,
                                         String folderPath,
                                         String newFileName) throws IOException {

        if (multipartFile == null || multipartFile.isEmpty()) {
            throw new IllegalArgumentException("文件为空，无法保存！");
        }

        // 创建目录
        File folder = new File(folderPath);
        if (!folder.exists() && !folder.mkdirs()) {
            throw new IOException("文件夹创建失败: " + folderPath);
        }

        // 使用新文件名存储
        File destFile = new File(folder, newFileName);

        multipartFile.transferTo(destFile);

        return destFile;
    }


    /**
     * 将本地文件路径转换为可访问的 URL
     *
     * @param file       本地文件对象
     * @param folderPath 本地静态资源根路径
     * @return 替换后的访问 URL
     */
    public static String toAccessUrl(File file, String folderPath) {
        if (file == null || folderPath == null) {
            return null;
        }
        // 统一路径分隔符，避免 Windows 和 Linux 不一致
        String absolutePath = file.getAbsolutePath().replace("\\", "/");
        String normalizedFolderPath = folderPath.replace("\\", "/");

        if (absolutePath.startsWith(normalizedFolderPath)) {
            return absolutePath.substring(normalizedFolderPath.length() + 1);
        }
        return file.getName();
    }

    /**
     * 根据上传文件名生成新的文件名（保留原始后缀）
     *
     * @param originalName 上传时的原始文件名，例如 "abc.png"
     * @return 新文件名，如 "d13f2b0e8b2a4abfa3d7c12345678901.png"
     */
    public static String generateNewImageName(String originalName) {
        if (originalName == null || originalName.isEmpty()) {
            throw new IllegalArgumentException("originalName cannot be null");
        }

        // 文件后缀（包含点）
        String suffix = "";
        int index = originalName.lastIndexOf(".");
        if (index != -1) {
            suffix = originalName.substring(index);
        }

        // 生成 UUID
        String uuid = java.util.UUID.randomUUID().toString().replace("-", "");

        return uuid + suffix;
    }


}
