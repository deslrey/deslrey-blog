package visit

import (
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

func GetClientIP(ctx *gin.Context) string {
	ip := ctx.GetHeader("x-forwarded-for")
	if ip != "" && !strings.EqualFold(ip, "unknown") {
		if strings.Contains(ip, ",") {
			return strings.TrimSpace(strings.Split(ip, ",")[0])
		}
		return strings.TrimSpace(ip)
	}

	ip = ctx.GetHeader("Proxy-Client-IP")
	if ip != "" && !strings.EqualFold(ip, "unknown") {
		return ip
	}

	ip = ctx.GetHeader("WL-Proxy-Client-IP")
	if ip != "" && !strings.EqualFold(ip, "unknown") {
		return ip
	}

	ip, _, _ = net.SplitHostPort(ctx.Request.RemoteAddr)
	return ip
}

func QueryIPLocation(ip string) string {
	if ip == "" || IsLocalAccess(ip) {
		return "本地访问"
	}

	client := &http.Client{Timeout: 2 * time.Second}
	url := fmt.Sprintf("https://opendata.baidu.com/api.php?query=%s&co=&resource_id=6006&oe=utf8", ip)

	resp, err := client.Get(url)
	if err != nil {
		return ""
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return ""
	}

	var result struct {
		Data []struct {
			Location string `json:"location"`
		} `json:"data"`
	}

	if err := json.Unmarshal(body, &result); err != nil {
		return ""
	}

	if len(result.Data) > 0 {
		return result.Data[0].Location
	}
	return ""
}

func GetDeviceType(userAgent string) string {
	if userAgent == "" {
		return "Unknown"
	}

	ua := strings.ToLower(userAgent)

	if strings.Contains(ua, "mobile") || strings.Contains(ua, "android") || strings.Contains(ua, "iphone") {
		return "Mobile"
	}
	if strings.Contains(ua, "ipad") || strings.Contains(ua, "tablet") {
		return "Tablet"
	}
	return "PC"
}

func IsLocalAccess(ip string) bool {
	if ip == "" {
		return false
	}

	ip = strings.TrimSpace(ip)

	if ip == "127.0.0.1" {
		return true
	}

	if ip == "::1" || ip == "0:0:0:0:0:0:0:1" {
		return true
	}

	if strings.HasPrefix(ip, "192.168.") {
		return true
	}

	if strings.HasPrefix(ip, "10.") {
		return true
	}

	if strings.HasPrefix(ip, "172.") {
		parts := strings.Split(ip, ".")
		if len(parts) >= 2 {
			var p1 int
			fmt.Sscanf(parts[1], "%d", &p1)
			if p1 >= 16 && p1 <= 31 {
				return true
			}
		}
	}

	return false
}
