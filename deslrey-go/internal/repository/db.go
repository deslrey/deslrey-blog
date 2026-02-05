package repository

import (
	"context"
	"deslrey-go/internal/biz/article"
	"deslrey-go/internal/biz/category"
	"deslrey-go/internal/biz/tag"
	"deslrey-go/internal/biz/user"
	"deslrey-go/internal/config"
	"deslrey-go/pkg/cache"
	pkgLogger "deslrey-go/pkg/logger"
	"log"
	"os"
	"strconv"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	gormLogger "gorm.io/gorm/logger"
)

var postgresqlDB *gorm.DB

func Init() {
	dsn := "host=" + config.Config.PostgreSQL.Host +
		" user=" + config.Config.PostgreSQL.User +
		" password=" + config.Config.PostgreSQL.Password +
		" dbname=" + config.Config.PostgreSQL.DBName +
		" port=" + strconv.Itoa(config.Config.PostgreSQL.Port) +
		" sslmode=disable TimeZone=Asia/Shanghai"
	var err error
	postgresqlDB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		PrepareStmt: true,
		Logger:      newGormLogger(),
	})
	if err != nil {
		pkgLogger.Logger.Fatal(err)
	}

	err = postgresqlDB.AutoMigrate(&article.Article{})

	postgresqlDB = postgresqlDB.Debug()

	if err != nil {
		pkgLogger.Logger.Fatal(err)
	}
	if postgresqlDB != nil {
		pkgLogger.Logger.Info("Postgresql数据库迁移成功")
	} else {
		pkgLogger.Logger.Fatal("Postgresql数据库连接失败")
	}

	user.InitDB(postgresqlDB)
	article.InitDB(postgresqlDB)
	category.InitDB(postgresqlDB)
	tag.InitDB(postgresqlDB)

	InitCache()
}

func InitCache() {
	cacheTagCount()
	cacheCategoryCount()
}

func cacheTagCount() {
	list, err := tag.SelectCounts()
	if err != nil {
		pkgLogger.Logger.Error("CacheTagCount failed", "err", err)
		return
	}
	cache.SetForever(context.Background(), "tag:count", list)
}

func cacheCategoryCount() {
	list, err := category.SelectCounts()
	if err != nil {
		pkgLogger.Logger.Error("CacheCategoryCount failed", "err", err)
		return
	}
	cache.SetForever(context.Background(), "category:count", list)
}

func newGormLogger() gormLogger.Interface {
	return gormLogger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		gormLogger.Config{
			SlowThreshold:             200 * time.Millisecond,
			LogLevel:                  gormLogger.Info,
			IgnoreRecordNotFoundError: true,
			Colorful:                  true,
		},
	)
}
