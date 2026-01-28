package redis

import (
	"context"
	"deslrey-go/configs"
	"deslrey-go/dao"
	"deslrey-go/logs"
	"encoding/json"
	"errors"
	"strconv"
	"sync"
	"time"

	"github.com/redis/go-redis/v9"
)

var (
	client *redis.Client
	once   sync.Once
)

// Init 初始化 Redis（只会执行一次）
func Init() {
	once.Do(func() {
		client = redis.NewClient(&redis.Options{
			Addr:     configs.Config.Redis.Host + ":" + strconv.Itoa(configs.Config.Redis.Port),
			Password: configs.Config.Redis.Password,
			DB:       configs.Config.Redis.DBName,
			PoolSize: configs.Config.Redis.Size,
		})

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		if err := client.Ping(ctx).Err(); err != nil {
			logs.Logger.Fatal("Redis 连接失败", "ERR", err)
		}

		logs.Logger.Info("Redis 连接成功")
	})
}

func InitCache() {
	cacheTagCount()
	cacheCategoryCount()
}

// GetClient 获取原生 client
func GetClient() *redis.Client {
	return client
}

// Set 存储 JSON 数据
func Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
	if client == nil {
		return errors.New("redis client not initialized")
	}

	data, err := json.Marshal(value)
	if err != nil {
		return err
	}

	return client.Set(ctx, key, data, expiration).Err()
}

func SetForever(ctx context.Context, key string, value interface{}) error {
	return Set(ctx, key, value, 0)
}

// Get 获取 JSON 数据
// 返回值：
//
//	found=false → key 不存在
func Get(ctx context.Context, key string, dest interface{}) (found bool, err error) {
	if client == nil {
		return false, errors.New("redis client not initialized")
	}

	val, err := client.Get(ctx, key).Result()
	if err != nil {
		if errors.Is(err, redis.Nil) {
			return false, nil
		}
		return false, err
	}

	err = json.Unmarshal([]byte(val), dest)
	return true, err
}

// Del 删除 key
func Del(ctx context.Context, keys ...string) error {
	if client == nil {
		return errors.New("redis client not initialized")
	}
	return client.Del(ctx, keys...).Err()
}

// Exists 判断 key 是否存在
func Exists(ctx context.Context, key string) (bool, error) {
	if client == nil {
		return false, errors.New("redis client not initialized")
	}
	n, err := client.Exists(ctx, key).Result()
	return n > 0, err
}

// Expire 设置过期时间
func Expire(ctx context.Context, key string, expiration time.Duration) error {
	if client == nil {
		return errors.New("redis client not initialized")
	}
	return client.Expire(ctx, key, expiration).Err()
}

// TTL 获取剩余过期时间
func TTL(ctx context.Context, key string) (time.Duration, error) {
	if client == nil {
		return 0, errors.New("redis client not initialized")
	}
	return client.TTL(ctx, key).Result()
}

// ---------- Hash ----------

func HSet(ctx context.Context, key, field string, value interface{}) error {
	if client == nil {
		return errors.New("redis client not initialized")
	}
	return client.HSet(ctx, key, field, value).Err()
}

func HGet(ctx context.Context, key, field string) (string, bool, error) {
	if client == nil {
		return "", false, errors.New("redis client not initialized")
	}

	val, err := client.HGet(ctx, key, field).Result()
	if err != nil {
		if err == redis.Nil {
			return "", false, nil
		}
		return "", false, err
	}

	return val, true, nil
}

// SetNX 分布式锁 / 防重复
func SetNX(ctx context.Context, key string, value interface{}, expiration time.Duration) (bool, error) {
	if client == nil {
		return false, errors.New("redis client not initialized")
	}

	data, err := json.Marshal(value)
	if err != nil {
		return false, err
	}

	return client.SetNX(ctx, key, data, expiration).Result()
}

// Incr 自增
func Incr(ctx context.Context, key string) (int64, error) {
	if client == nil {
		return 0, errors.New("redis client not initialized")
	}
	return client.Incr(ctx, key).Result()
}

// 初始化标签的个数
func cacheTagCount() {

	list, err := dao.SelectTagCounts()
	if err != nil {
		logs.Logger.Error("CacheTagCount failed", "err", err)
		return
	}

	SetForever(context.Background(), "tag:count", list)
}

// 初始化分类的个数
func cacheCategoryCount() {

	list, err := dao.SelectCategoryCounts()
	if err != nil {
		logs.Logger.Error("CacheTagCount failed", "err", err)
		return
	}

	SetForever(context.Background(), "category:count", list)
}
