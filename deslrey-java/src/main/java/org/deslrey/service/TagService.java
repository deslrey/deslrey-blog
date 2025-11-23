package org.deslrey.service;

import com.github.pagehelper.PageInfo;
import org.deslrey.entity.po.Article;
import org.deslrey.entity.po.Tag;
import org.deslrey.entity.vo.CountVO;
import org.deslrey.result.Results;

import java.util.List;

/**
 * <br>
 * 标签接口
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/8 14:51
 */
public interface TagService {
    Results<List<CountVO>> tagCount();

    Results<List<Article>> tagArticle(String title);

    Results<PageInfo<Tag>> tagList(int page, int pageSize);

}
