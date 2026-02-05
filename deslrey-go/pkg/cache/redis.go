package cache

import (
	"context"
	"deslrey-go/internal/config"
	"deslrey-go/pkg/logger"
	"encoding/json"
	"errors"
	"strconv"
	"sync"
	"time"

	"github.com/redis/go-redis/v9"
)

var (
	client    *redis.Client
	once      sync.Once
	KeyPrefix = "deslrey:"
	TokenKey  = KeyPrefix + "token:"
)

func Init() {
	once.Do(func() {
		client = redis.NewClient(&redis.Options{
			Addr:     config.Config.Redis.Host + ":" + strconv.Itoa(config.Config.Redis.Port),
			Password: config.Config.Redis.Password,
			DB:       config.Config.Redis.DBName,
			PoolSize: config.Config.Redis.Size,
		})

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		if err := client.Ping(ctx).Err(); err != nil {
			logger.Logger.Fatal("Redis 连接失败", "ERR", err)
		}

		logger.Logger.Info("Redis 连接成功")
	})
}

func GetClient() *redis.Client {
	return client
}

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

func Del(ctx context.Context, keys ...string) error {
	if client == nil {
		return errors.New("redis client not initialized")
	}
	return client.Del(ctx, keys...).Err()
}

func Exists(ctx context.Context, key string) (bool, error) {
	if client == nil {
		return false, errors.New("redis client not initialized")
	}
	n, err := client.Exists(ctx, key).Result()
	return n > 0, err
}

func Expire(ctx context.Context, key string, expiration time.Duration) error {
	if client == nil {
		return errors.New("redis client not initialized")
	}
	return client.Expire(ctx, key, expiration).Err()
}

func TTL(ctx context.Context, key string) (time.Duration, error) {
	if client == nil {
		return 0, errors.New("redis client not initialized")
	}
	return client.TTL(ctx, key).Result()
}

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

func Incr(ctx context.Context, key string) (int64, error) {
	if client == nil {
		return 0, errors.New("redis client not initialized")
	}
	return client.Incr(ctx, key).Result()
}
