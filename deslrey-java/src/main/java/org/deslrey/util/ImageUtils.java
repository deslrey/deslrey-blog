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
    public static File saveMultipartFile(MultipartFile multipartFile, String folderPath) throws IOException {
        if (multipartFile == null || multipartFile.isEmpty()) {
            throw new IllegalArgumentException("文件为空，无法保存！");
        }

        // 创建文件夹
        File folder = new File(folderPath);
        if (!folder.exists()) {
            boolean created = folder.mkdirs(); // 创建多层目录
            if (!created) {
                throw new IOException("文件夹创建失败: " + folderPath);
            }
        }

        // 目标文件（保持原文件名）
        File destFile = new File(folder, Objects.requireNonNull(multipartFile.getOriginalFilename()));

        // 保存文件
        multipartFile.transferTo(destFile);

        return destFile;
    }
}
