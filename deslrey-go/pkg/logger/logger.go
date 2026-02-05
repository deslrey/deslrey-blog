package logger

import (
	"deslrey-go/internal/config"
	"io"
	"os"

	"gopkg.in/natefinch/lumberjack.v2"

	"github.com/charmbracelet/log"
)

var Logger *log.Logger

func Init() {
	if config.Config.Debug {
		Logger = log.NewWithOptions(os.Stderr, log.Options{
			Level:           log.DebugLevel,
			ReportCaller:    true,
			ReportTimestamp: true,
		})
	} else {

		jackLogger := &lumberjack.Logger{
			Filename:   "./logs/logs",
			MaxSize:    500,
			MaxBackups: 3,
			MaxAge:     28,
			Compress:   true,
		}

		multiWriter := io.MultiWriter(os.Stderr, jackLogger)

		Logger = log.NewWithOptions(multiWriter, log.Options{
			Level:           log.WarnLevel,
			ReportTimestamp: true,
		})
	}
}
