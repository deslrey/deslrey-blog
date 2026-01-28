package dao

import (
	"deslrey-go/configs"
	"deslrey-go/logs"
	"deslrey-go/models"
	"log"
	"os"
	"strconv"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var postgresqlDB *gorm.DB

func Init() {
	dsn := "host=" + configs.Config.PostgreSQL.Host +
		" user=" + configs.Config.PostgreSQL.User +
		" password=" + configs.Config.PostgreSQL.Password +
		" dbname=" + configs.Config.PostgreSQL.DBName +
		" port=" + strconv.Itoa(configs.Config.PostgreSQL.Port) +
		" sslmode=disable TimeZone=Asia/Shanghai"
	var err error
	postgresqlDB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		PrepareStmt: true, // 缓存预编译语句
		Logger:      newGormLogger(),
	})
	if err != nil {
		logs.Logger.Fatal(err)
	}
	// 不会校验账号密码是否正确

	//自动迁移模型
	err = postgresqlDB.AutoMigrate(&models.Article{})

	//调试所有sql
	postgresqlDB = postgresqlDB.Debug()

	if err != nil {
		logs.Logger.Fatal(err)
	}
	// 设置默认DB对象
	// 检查数据库连接是否成功
	if postgresqlDB != nil {
		logs.Logger.Info("Postgresql数据库迁移成功")
	} else {
		logs.Logger.Fatal("Postgresql数据库连接失败")
	}

}

func newGormLogger() logger.Interface {
	return logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold:             200 * time.Millisecond,
			LogLevel:                  logger.Info, // 打印所有 SQL
			IgnoreRecordNotFoundError: true,
			Colorful:                  true,
		},
	)
}
