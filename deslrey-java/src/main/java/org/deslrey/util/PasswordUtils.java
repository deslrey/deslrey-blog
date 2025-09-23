package org.deslrey.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

public class PasswordUtils {

    /**
     * 生成随机盐
     */
    public static String generateSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16]; // 128 位
        random.nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }

    /**
     * 使用 SHA-256 对密码加盐哈希
     */
    public static String hashPassword(String password, String salt) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            // 把盐加到密码前后
            String saltedPassword = salt + password;
            byte[] hashedBytes = md.digest(saltedPassword.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hashedBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("加密算法不存在", e);
        }
    }

    /**
     * 校验密码是否正确
     */
    public static boolean verifyPassword(String inputPassword, String salt, String storedHash) {
        String inputHash = hashPassword(inputPassword, salt);
        return storedHash.equals(inputHash);
    }

    // 测试用例
    public static void main(String[] args) {
        String password = "123456";
//        String salt = generateSalt(); // 注册时生成随机盐
        String salt = "KWmglTGVYbF1DGF9Xs7T1w"; // 注册时生成随机盐
        String hash = hashPassword(password, salt);

        System.out.println("原始密码: " + password);
        System.out.println("盐: " + salt);
        System.out.println("哈希值: " + hash);

        // 校验
        boolean isValid = verifyPassword("123456", salt, hash);
        System.out.println("校验结果: " + isValid);
    }
}
