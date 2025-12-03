package org.deslrey.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.deslrey.entity.po.Article;
import org.deslrey.entity.po.ArticleDraft;
import org.deslrey.entity.po.Category;
import org.deslrey.entity.vo.ArticleDraftVO;
import org.deslrey.mapper.ArticleMapper;
import org.deslrey.mapper.ArticleTagMapper;
import org.deslrey.mapper.CategoryMapper;
import org.deslrey.result.ResultCodeEnum;
import org.deslrey.result.Results;
import org.deslrey.service.ArticleService;
import org.deslrey.util.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * <br>
 *
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/7 20:34
 */
@Service
public class ArticleServiceImpl implements ArticleService {

    @Autowired
    private ArticleMapper articleMapper;

    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private ArticleTagMapper articleTagMapper;

    @Override
    public Results<List<Article>> LatestReleases() {
        List<Article> articleList = articleMapper.selectLatestReleases();
        if (articleList == null || articleList.isEmpty()) {
            return Results.ok(new ArrayList<>());
        }
        return Results.ok(articleList);
    }

    @Override
    public Results<PageInfo<Article>> articleList(int page, int pageSize) {
        if (page < 1)
            page = 1;
        if (pageSize < 1)
            pageSize = 1;
        PageHelper.startPage(page, pageSize);
        List<Article> articleList = articleMapper.selectArticleList();
        PageInfo<Article> articlePageInfo = new PageInfo<>(articleList);
        return Results.ok(articlePageInfo);
    }

    @Override
    public Results<PageInfo<Article>> adminArticleList(int page, int pageSize) {
        if (page < 1)
            page = 1;
        if (pageSize < 1)
            pageSize = 1;
        PageHelper.startPage(page, pageSize);
        List<Article> articleList = articleMapper.selectAdminArticleList();
        PageInfo<Article> articlePageInfo = new PageInfo<>(articleList);
        return Results.ok(articlePageInfo);
    }

    @Override
    public Results<Article> articleDetail(Integer id) {
        if (NumberUtils.isLessZero(id)) {
            return Results.fail(ResultCodeEnum.CODE_501);
        }

        Article article = articleMapper.selectArticleDetail(id);
        if (article == null) {
            return Results.fail("查找文章失败");
        }
        return Results.ok(article);
    }

    @Override
    public Results<List<Article>> viewHot() {
        List<Article> articleList = articleMapper.selectViewHot();
        return Results.ok(articleList);
    }

    @Override
    public Results<ArticleDraftVO> editArticle(Integer articleId) {
        if (NumberUtils.isLessZero(articleId)) {
            return Results.fail(ResultCodeEnum.CODE_501);
        }
        Article article = articleMapper.selectEditArticleById(articleId);
        if (article == null) {
            return Results.fail("获取编辑文章失败,暂无数据");
        }

        ArticleDraftVO articleDraftVO = new ArticleDraftVO();
        articleDraftVO.setId(article.getId());
        articleDraftVO.setTitle(article.getTitle());
        articleDraftVO.setContent(article.getContent());
        articleDraftVO.setDes(article.getDes());

        List<Integer> articleTagList = articleTagMapper.selectArticleTagListById(articleId);
        if (articleTagList == null) {
            articleTagList = new ArrayList<>(0);
        }
        articleDraftVO.setTagIdList(articleTagList);

        Category category = categoryMapper.selectCategoryByTitle(article.getCategory());
        if (category != null) {
            articleDraftVO.setCategory(category);
        }
        return Results.ok(articleDraftVO);
    }

    @Override
    public Results<Void> addArticle(ArticleDraft articleDraft) {
        if (articleDraft == null) {
            return Results.fail(ResultCodeEnum.CODE_501);
        }

        // 构建 Article
        Article article = new Article();
        article.setId(articleDraft.getId());
        article.setTitle(articleDraft.getTitle());
        article.setContent(articleDraft.getContent());
        String content = articleDraft.getContent() == null ? "" : articleDraft.getContent();
        article.setWordCount(content.length());
        int readTime = Math.max(1, content.length() / 200);
        article.setReadTime(readTime);
        article.setCategory(articleDraft.getCategory());
        article.setDes(articleDraft.getDes());
        article.setExist(true);

        LocalDateTime now = LocalDateTime.now();

        int result;

        if (articleDraft.getId() == null) {
            article.setViews(0);
            article.setCreateTime(now);
            article.setUpdateTime(now);
            article.setEdit(false);
            result = articleMapper.insertArticle(article);
        } else {
            article.setUpdateTime(now);
            article.setEdit(true);
            result = articleMapper.updateArticle(article);
        }

        if (articleDraft.getId() != null) {
            articleTagMapper.deleteTagByArticleId(articleDraft.getId());
        }

        if (articleDraft.getTagIdList() != null) {
            for (Integer tagId : articleDraft.getTagIdList()) {
                articleTagMapper.insertArticleTag(article.getId(), tagId);
            }
        }

        if (result <= 0) {
            return Results.fail("保存失败");
        }

        return Results.ok("保存成功");
    }

    @Override
    public Results<Void> editExist(Article article) {
        if (article == null) {
            return Results.fail("编辑失败");
        }
        if (NumberUtils.isLessZero(article.getId()) || article.getExist() == null) {
            return Results.fail("编辑失败");
        }

        int result = articleMapper.updateExist(article.getId(), article.getExist());
        if (result > 0) {
            return Results.ok("操作成功");
        }
        return Results.fail("操作失败");
    }
}
