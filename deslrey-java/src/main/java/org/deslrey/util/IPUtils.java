package org.deslrey.util;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

/**
 * <br>
 * IP处理工具类
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/24 17:06
 */
public class IPUtils {

    /**
     * 获取客户端真实IP（支持多级 Nginx 反代）
     */
    public static String getClientIP(HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
            // 多个IP取第一个
            if (ip.contains(",")) {
                return ip.split(",")[0].trim();
            }
            return ip.trim();
        }

        ip = request.getHeader("Proxy-Client-IP");
        if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
            return ip;
        }

        ip = request.getHeader("WL-Proxy-Client-IP");
        if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
            return ip;
        }

        // 最后才取 remoteAddr
        ip = request.getRemoteAddr();
        return ip;
    }

    /**
     * 调用百度 API 查询 IP 归属地，只返回 location 字段
     */
    public static String queryIPLocation(String ip) {
        try {
            String url = "https://opendata.baidu.com/api.php?query=" + ip +
                    "&co=&resource_id=6006&oe=utf8";

            // 加超时设置
            SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
            factory.setConnectTimeout(2000); // 连接超时 2 秒
            factory.setReadTimeout(2000);    // 读取超时 2 秒

            RestTemplate restTemplate = new RestTemplate(factory);
            String json = restTemplate.getForObject(url, String.class);

            JSONObject obj = JSON.parseObject(json);
            JSONArray data = obj.getJSONArray("data");

            if (data != null && !data.isEmpty()) {
                String location = data.getJSONObject(0).getString("location");
                return location != null ? location : "";
            }
        } catch (Exception ignored) {
        }

        return "";
    }


    /**
     * 判断设备类型
     */
    public static String getDeviceType(String userAgent) {
        if (userAgent == null) return "Unknown";

        String ua = userAgent.toLowerCase();

        if (ua.contains("mobile") || ua.contains("android") || ua.contains("iphone")) {
            return "Mobile";
        }
        if (ua.contains("ipad") || ua.contains("tablet")) {
            return "Tablet";
        }
        return "PC";
    }

    /**
     * 判断是否为本机访问
     */
    public static boolean isLocalAccess(String ip) {
        if (ip == null) return false;

        ip = ip.trim();

        // IPv4 本地
        if ("127.0.0.1".equals(ip)) return true;

        // IPv6 本地
        if ("0:0:0:0:0:0:0:1".equals(ip) || "::1".equals(ip)) return true;

        // 内网 IP：192.168.x.x
        if (ip.startsWith("192.168.")) return true;

        // 内网 IP：10.x.x.x
        if (ip.startsWith("10.")) return true;

        // 内网 IP：172.16.x.x - 172.31.x.x
        if (ip.startsWith("172.")) {
            try {
                String[] parts = ip.split("\\.");
                int p1 = Integer.parseInt(parts[1]);
                if (p1 >= 16 && p1 <= 31) {
                    return true;
                }
            } catch (Exception ignored) {
            }
        }

        return false;
    }

}
