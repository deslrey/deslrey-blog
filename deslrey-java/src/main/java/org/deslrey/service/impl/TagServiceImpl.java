package org.deslrey.service.impl;

import com.alibaba.fastjson2.JSON;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.deslrey.entity.po.Article;
import org.deslrey.entity.po.Tag;
import org.deslrey.entity.vo.ArticleListVO;
import org.deslrey.entity.vo.ArticleTagVO;
import org.deslrey.entity.vo.CountVO;
import org.deslrey.mapper.ArticleMapper;
import org.deslrey.mapper.ArticleTagMapper;
import org.deslrey.mapper.TagMapper;
import org.deslrey.result.ResultCodeEnum;
import org.deslrey.result.Results;
import org.deslrey.service.TagService;
import org.deslrey.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * <br>
 * 标签接口实现类
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/15 11:44
 */
@Service
public class TagServiceImpl implements TagService {

    @Autowired
    private TagMapper tagMapper;

    @Autowired
    private ArticleTagMapper articleTagMapper;

    @Autowired
    private RedisUtils redisUtils;

    @Autowired
    private DataInitUtils dataInitUtils;

    @Override
    public Results<PageInfo<Tag>> tagList(int page, int pageSize) {
        PageHelper.startPage(page, pageSize);
        List<Tag> tagList = tagMapper.selectTagList();
        if (tagList == null || tagList.isEmpty()) {
            return Results.ok(new PageInfo<>(new ArrayList<>()));
        }
        PageInfo<Tag> tagPageInfo = new PageInfo<>(tagList);
        return Results.ok(tagPageInfo);
    }

    @Override
    public Results<List<CountVO>> tagCount() {
        String tagJson = redisUtils.get(StaticUtils.TAG_COUNT);
        if (StringUtils.isEmpty(tagJson)) {
            List<CountVO> tagCountVOList = tagMapper.selectTagCount();
            if (tagCountVOList == null || tagCountVOList.isEmpty()) {
                return Results.ok(new ArrayList<>(0));
            }
            redisUtils.set(StaticUtils.TAG_COUNT, JSON.toJSONString(tagCountVOList));
            return Results.ok(tagCountVOList);
        } else {
            List<CountVO> list = JSON.parseArray(tagJson, CountVO.class);
            if (list == null || list.isEmpty()) {
                return Results.ok(new ArrayList<>(0));
            }
            return Results.ok(list);
        }
    }

    @Override
    public Results<PageInfo<ArticleListVO>> tagArticle(String title, int page, int pageSize) {
        if (StringUtils.isEmpty(title)) {
            return Results.ok(new PageInfo<>(new ArrayList<>(0)));
        }

        Integer tagId = tagMapper.selectIdByTitle(title);

        if (tagId == null) {
            return Results.ok(new PageInfo<>(new ArrayList<>(0)));
        }

        PageHelper.startPage(page, pageSize);
        List<ArticleListVO> articleList = articleTagMapper.selectArticleTag(tagId);
        if (ArticleServiceImpl.ArticleTags(articleList, articleTagMapper)) return Results.ok(new PageInfo<>(new ArrayList<>(0)));

        return Results.ok(new PageInfo<>(new ArrayList<>(articleList)));
    }


    @Override
    public Results<Void> addTag(Tag tag) {
        if (tag == null || StringUtils.isBlank(tag.getTagTitle())) {
            return Results.fail(ResultCodeEnum.EMPTY_VALUE);
        }

        int result = tagMapper.insertTag(tag.getTagTitle());
        if (result > 0) {
            dataInitUtils.TagInit();
            return Results.ok("新增成功");
        }
        return Results.fail("新增失败");
    }

    @Override
    public Results<Void> updateTagTitle(Tag tag) {
        if (tag == null || NumberUtils.isLessZero(tag.getId()) || StringUtils.isBlank(tag.getTagTitle())) {
            return Results.fail(ResultCodeEnum.EMPTY_VALUE);
        }

        int result = tagMapper.updateTagTitle(tag);
        if (result > 0) {
            dataInitUtils.TagInit();
            return Results.ok("修改成功");
        }
        return Results.fail("更新失败");
    }

    @Override
    public Results<List<Tag>> tagNameList() {
        List<Tag> tagList = tagMapper.selectTagNameList();
        if (tagList == null || tagList.isEmpty()) {
            return Results.ok(new ArrayList<>(0));
        }
        return Results.ok(tagList);
    }
}
