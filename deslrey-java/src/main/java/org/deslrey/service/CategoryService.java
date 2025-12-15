package org.deslrey.service;

import com.github.pagehelper.PageInfo;
import org.deslrey.entity.po.Article;
import org.deslrey.entity.po.Category;
import org.deslrey.entity.vo.ArticleListVO;
import org.deslrey.entity.vo.CountVO;
import org.deslrey.result.Results;

import java.util.List;

/**
 * <br>
 * 分类接口
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/8 14:29
 */
public interface CategoryService {
    Results<List<CountVO>> categoryCount();

    Results<PageInfo<ArticleListVO>> categoryArticle(String title, int page, int pageSize);

    Results<PageInfo<Category>> categoryList(int page, int pageSize);

    Results<Void> addCategory(Category category);

    Results<Void> updateCategoryTitle(Category category);

    Results<List<Category>> categoryArticleList();

}
