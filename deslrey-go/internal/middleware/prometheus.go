package middleware

import (
	"deslrey-go/pkg/logger"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus"
)

const (
	PrometheusNamespace    = "deslrey_data"
	EndpointsDataSubsystem = "endpoints"
)

var (
	endpointsLatencyMonitor = prometheus.NewHistogramVec(
		prometheus.HistogramOpts{
			Namespace: PrometheusNamespace,
			Subsystem: EndpointsDataSubsystem,
			Name:      "latency_statistic",
			Help:      "统计接口耗时(ms)",
			Buckets:   []float64{1, 5, 10, 20, 50, 100, 500, 1000, 5000, 10000},
		},
		[]string{"path", "method", "status"},
	)
)

func init() {
	prometheus.MustRegister(endpointsLatencyMonitor)
}

func HandleEndpointLatency() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()

		c.Next()

		latency := time.Since(start)
		latencyMs := float64(latency.Milliseconds())
		path := c.FullPath()
		if path == "" {
			path = c.Request.URL.Path
		}
		statusCode := c.Writer.Status()

		if latencyMs >= 300 {
			logger.Logger.Warn("slow endpoint", "path", path, "method", c.Request.Method, "status", statusCode, "latency_ms", latencyMs)
		}

		endpointsLatencyMonitor.WithLabelValues(path, c.Request.Method, strconv.Itoa(statusCode)).Observe(latencyMs)
	}
}
