package middleware

import (
	"deslrey-go/pkg/logger"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus"
)

const (
	PrometheusNamespace    = "deslrey_data"
	EndpointsDataSubsystem = "endpoints"
)

var (
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

func HandleEndpointLantency() gin.HandlerFunc {
	return func(c *gin.Context) {
		endpoint := c.Request.URL.Path
		start := time.Now()

		c.Next()

		latency := time.Since(start)
		latencyMs := float64(latency.Milliseconds())

		logger.Logger.Infof("接口 %s 耗时 %fms", endpoint, latencyMs)

		endpointsLantencyMonitor.WithLabelValues(endpoint).Observe(latencyMs)
	}
}
