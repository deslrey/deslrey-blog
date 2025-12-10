package org.deslrey.util;

import com.alibaba.fastjson2.JSON;
import org.deslrey.entity.vo.CountVO;
import org.deslrey.mapper.CategoryMapper;
import org.deslrey.mapper.TagMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * <br>
 * 缓存数据工具类
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/12/10 20:29
 */
@Component
public class DataInitUtils {

    @Autowired
    private RedisUtils redisUtils;

    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private TagMapper tagMapper;

    public void CategoryInit() {
        List<CountVO> categoryCount = categoryMapper.selectCategoryCount();
        if (categoryCount != null) {
            String json = JSON.toJSONString(categoryCount);
            redisUtils.set(StaticUtils.CATEGORY_COUNT, json);
        }
    }

    public void TagInit() {
        List<CountVO> tagCount = tagMapper.selectTagCount();
        if (tagCount != null) {
            String json = JSON.toJSONString(tagCount);
            redisUtils.set(StaticUtils.TAG_COUNT, json);
        }
    }

}
