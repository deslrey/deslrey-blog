package middleware

import (
	"deslrey-go/logs"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus"
)

const (
	PrometheusNamespace    = "deslrey_data"
	EndpointsDataSubsystem = "endpoints"
)

var (
	// 只保留 Histogram，不再 push
	endpointsLantencyMonitor = prometheus.NewHistogramVec(
		prometheus.HistogramOpts{
			Namespace: PrometheusNamespace,
			Subsystem: EndpointsDataSubsystem,
			Name:      "lantency_statistic",
			Help:      "统计接口耗时(ms)",
			Buckets:   []float64{1, 5, 10, 20, 50, 100, 500, 1000, 5000, 10000},
		},
		[]string{"path"},
	)
)

func init() {
	prometheus.MustRegister(endpointsLantencyMonitor)
}

// HandleEndpointLantency 记录接口耗时
func HandleEndpointLantency() gin.HandlerFunc {
	return func(c *gin.Context) {
		endpoint := c.Request.URL.Path
		start := time.Now()

		// 请求执行
		c.Next()

		// 计算耗时
		latency := time.Since(start)
		latencyMs := float64(latency.Milliseconds())

		logs.Logger.Infof("接口 %s 耗时 %fms", endpoint, latencyMs)

		// 上报到 Histogram
		endpointsLantencyMonitor.WithLabelValues(endpoint).Observe(latencyMs)
	}
}
