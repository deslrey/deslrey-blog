package org.deslrey.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.deslrey.convert.ArticleConvert;
import org.deslrey.convert.ArticleDraftConvert;
import org.deslrey.entity.admin.po.ArticleDraft;
import org.deslrey.entity.admin.vo.ArticleAdminVO;
import org.deslrey.entity.admin.vo.ArticleDraftVO;
import org.deslrey.entity.po.Article;
import org.deslrey.entity.po.ArticleTag;
import org.deslrey.entity.po.Category;
import org.deslrey.entity.vo.ArchiveVO;
import org.deslrey.entity.vo.ArticleVO;
import org.deslrey.entity.vo.CategoryVO;
import org.deslrey.entity.vo.LatestReleasesVO;
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
 * 文章接口实现类
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/5 15:37
 */
@Service
public class ArticleServiceImpl implements ArticleService {

    @Autowired
    private ArticleMapper articleMapper;

    @Autowired
    private ArticleConvert articleConvert;

    @Autowired
    private ArticleTagMapper articleTagMapper;

    @Autowired
    private CategoryMapper categoryMapper;

    /**
     * 查询最新发布的五篇文章
     */
    @Override
    public Results<List<LatestReleasesVO>> latestReleases() {
        List<LatestReleasesVO> latestReleasesVOS = articleMapper.latestReleases();
        if (latestReleasesVOS == null || latestReleasesVOS.isEmpty()) {
            return Results.ok(new ArrayList<>());
        }
        return Results.ok(latestReleasesVOS);
    }

    public Results<List<ArticleVO>> getArticlesByPage(int page, int pageSize) {
        int offset = (page - 1) * pageSize;
        List<Article> articleList = articleMapper.getArticlesByPage(offset, pageSize);
        if (articleList == null || articleList.isEmpty()) {
            return Results.ok();
        }
        return Results.ok(articleConvert.articleVOList(articleList));
    }

    @Override
    public Results<Article> detail(Integer id) {
        if (NumberUtils.isLessZero(id)) {
            return Results.fail(ResultCodeEnum.CODE_501);
        }

        Article article = articleMapper.detail(id);
        if (article == null) {
            return Results.fail("查找文章失败");
        }
        return Results.ok(article);
    }

    @Override
    public Results<List<ArchiveVO>> archiveList() {
        List<ArchiveVO> articleVOList = articleMapper.archiveList();
        if (articleVOList == null || articleVOList.isEmpty()) {
            return Results.ok(new ArrayList<>());
        }
        return Results.ok(articleVOList);
    }

    @Override
    public Results<PageInfo<ArticleAdminVO>> articleListAdmin(int page, int pageSize) {
        // 启动分页
        PageHelper.startPage(page, pageSize);
        List<ArticleAdminVO> list = articleMapper.getArticlesAdmin();
        // PageInfo 包含分页结果（list, total, pages 等）
        PageInfo<ArticleAdminVO> pageInfo = new PageInfo<>(list);
        return Results.ok(pageInfo);
    }

    @Override
    public Results<Void> addArticle(ArticleDraft articleDraft) {
        if (articleDraft == null) {
            return Results.fail(ResultCodeEnum.EMPTY_VALUE);
        }

        Article article = new Article();
        article.setTitle(articleDraft.getTitle());
        article.setContent(articleDraft.getContent());
        article.setWordCount(articleDraft.getContent().length());
        article.setViews(0);
        article.setCreateTime(LocalDateTime.now());
        article.setUpdateTime(LocalDateTime.now());
        article.setCategory(articleDraft.getCategory());
        article.setDes(articleDraft.getDes());
        article.setSticky(false);
        article.setEdit(false);
        article.setExist(true);


        int result = articleMapper.insertArticle(article);
        if (result <= 0) {
            return Results.fail("保存失败");
        }
        List<Integer> tagIdList = articleDraft.getTagIdList();
        for (Integer tagId : tagIdList) {
            articleTagMapper.insertArticleTag(article.getId(), tagId);
        }

        return Results.ok("保存成功");
    }

    @Override
    public Results<ArticleDraftVO> editArticle(Integer articleId) {
        if (NumberUtils.isLessZero(articleId)) {
            return Results.fail(ResultCodeEnum.CODE_501);
        }
        Article article = articleMapper.editArticle(articleId);
        if (article == null) {
            return Results.fail("获取失败,暂无数据");
        }

        ArticleDraftVO articleDraftVO = ArticleDraftConvert.INSTANCE.convertVO(article);

        List<Integer> articleTagList = articleTagMapper.selectArticleTagListById(articleId);
        if (articleTagList == null) {
            articleTagList = new ArrayList<>();
        }
        CategoryVO categoryVO = categoryMapper.selectCategoryByTitle(article.getCategory());
        if (categoryVO != null) {
            articleDraftVO.setCategoryPO(categoryVO);
        }
        articleDraftVO.setTagIdList(articleTagList);
        return Results.ok(articleDraftVO);
    }

    @Override
    public Results<PageInfo<Article>> articles(int page, int pageSize) {
        PageHelper.startPage(page, pageSize);

        List<Article> articleList = articleMapper.selectArticles();
        if (articleList == null || articleList.isEmpty()) {
            return Results.ok(new PageInfo<>(new ArrayList<>()));
        }

        PageInfo<Article> articlePageInfo = new PageInfo<>(articleList);
        return Results.ok(articlePageInfo);
    }
}
