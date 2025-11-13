package org.deslrey.service.impl;

import org.deslrey.entity.po.Article;
import org.deslrey.entity.vo.CountVO;
import org.deslrey.mapper.ArticleMapper;
import org.deslrey.mapper.ArticleTagMapper;
import org.deslrey.mapper.TagMapper;
import org.deslrey.result.Results;
import org.deslrey.service.TagService;
import org.deslrey.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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

    @Override
    public Results<List<CountVO>> tagCount() {
        List<CountVO> tagCountVOList = tagMapper.selectTagCount();
        if (tagCountVOList == null || tagCountVOList.isEmpty()) {
            return Results.ok(new ArrayList<>());
        }
        return Results.ok(tagCountVOList);
    }

    @Override
    public Results<List<Article>> tagArticle(String title) {
        if (StringUtils.isEmpty(title)) {
            return Results.ok(new ArrayList<>(0));
        }

        Integer tagId = tagMapper.selectIdByTitle(title);

        if (tagId == null) {
            return Results.ok(new ArrayList<>(0));
        }

        List<Article> articleList = articleTagMapper.selectArticleTag(tagId);
        if (articleList == null || articleList.isEmpty()) {
            return Results.ok(new ArrayList<>(0));
        }
        return Results.ok(articleList);
    }
}
