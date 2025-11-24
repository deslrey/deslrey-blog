package org.deslrey.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * <br>
 * redis工具类
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/24 18:24
 */
@Component
public class RedisUtils {

    @Autowired
    private StringRedisTemplate redisTemplate;

    // =======================  String 操作 =======================

    // 设置值
    public void set(String key, String value) {
        redisTemplate.opsForValue().set(key, value);
    }

    // 设置值 + 过期时间（秒）
    public void set(String key, String value, long timeoutSeconds) {
        redisTemplate.opsForValue().set(key, value, timeoutSeconds, TimeUnit.SECONDS);
    }

    // 获取值
    public String get(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    // 删除 key
    public Boolean del(String key) {
        return redisTemplate.delete(key);
    }

    // 判断 key 是否存在
    public Boolean hasKey(String key) {
        return redisTemplate.hasKey(key);
    }

    // 自增
    public Long incr(String key) {
        return redisTemplate.opsForValue().increment(key);
    }

    // 自减
    public Long decr(String key) {
        return redisTemplate.opsForValue().decrement(key);
    }


    // =======================  Hash 操作 =======================

    // 存放一个字段
    public void hset(String key, String field, String value) {
        redisTemplate.opsForHash().put(key, field, value);
    }

    // 批量存放
    public void hsetAll(String key, Map<String, String> map) {
        redisTemplate.opsForHash().putAll(key, map);
    }

    // 获取某个字段
    public String hget(String key, String field) {
        Object val = redisTemplate.opsForHash().get(key, field);
        return val.toString();
    }

    // 删除某个字段
    public void hdel(String key, String field) {
        redisTemplate.opsForHash().delete(key, field);
    }

    // 获取整个 hash
    public Map<Object, Object> hgetAll(String key) {
        return redisTemplate.opsForHash().entries(key);
    }


    // =======================  List 操作 =======================

    // 左压入
    public void lpush(String key, String value) {
        redisTemplate.opsForList().leftPush(key, value);
    }

    // 右压入
    public void rpush(String key, String value) {
        redisTemplate.opsForList().rightPush(key, value);
    }

    // 弹出（左）
    public String lpop(String key) {
        return redisTemplate.opsForList().leftPop(key);
    }

    // 弹出（右）
    public String rpop(String key) {
        return redisTemplate.opsForList().rightPop(key);
    }

    // 获取范围
    public java.util.List<String> lrange(String key, long start, long end) {
        return redisTemplate.opsForList().range(key, start, end);
    }


    // =======================  Set 操作 =======================

    // 添加 Set 成员
    public void sadd(String key, String value) {
        redisTemplate.opsForSet().add(key, value);
    }

    // 判断成员是否存在
    public boolean sismember(String key, String value) {
        return Boolean.TRUE.equals(redisTemplate.opsForSet().isMember(key, value));
    }

    // 获取整个 set
    public java.util.Set<String> smembers(String key) {
        return redisTemplate.opsForSet().members(key);
    }

    // 移除 set 元素
    public void srem(String key, String value) {
        redisTemplate.opsForSet().remove(key, value);
    }

    // ======================= Keys 操作 =======================
    public java.util.Set<String> keys(String pattern) {
        return redisTemplate.keys(pattern);
    }

    // 原子读取并重置
    public String getAndSet(String key, String value) {
        return redisTemplate.opsForValue().getAndSet(key, value);
    }

    // Hash 原子自增
    public Long hincrBy(String key, String field, long delta) {
        return redisTemplate.opsForHash().increment(key, field, delta);
    }


}