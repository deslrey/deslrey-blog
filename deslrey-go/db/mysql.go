package db

import (
	"fmt"
	"log"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var mysqlDB *gorm.DB

// InitMysql 初始化 MySQL 连接
func InitMysql() {
	dsn := "root:200381@tcp(localhost:3306)/blog?charset=utf8mb4&parseTime=True&loc=Local"

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		PrepareStmt: true,
		// 配置日志输出（调试时用 Info，生产建议 Warn/ Error）
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("数据库连接失败: %v", err)
	}

	// 设置连接池参数
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("获取底层 DB 对象失败: %v", err)
	}

	sqlDB.SetMaxOpenConns(50)           // 最大打开连接数
	sqlDB.SetMaxIdleConns(10)           // 最大空闲连接数
	sqlDB.SetConnMaxLifetime(time.Hour) // 连接最大生命周期

	mysqlDB = db
	fmt.Println("MySQL 数据库连接成功！")
}

// GetDB 全局获取 DB 的方法
func GetDB() *gorm.DB {
	return mysqlDB
}
