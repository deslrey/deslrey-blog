package org.deslrey.service;

import com.github.pagehelper.PageInfo;
import org.deslrey.entity.po.Draft;
import org.deslrey.result.Results;

/**
 * <br>
 * 草稿接口
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/22 10:52
 */
public interface DraftService {
    Results<PageInfo<Draft>> draftList(int page, int pageSize);

}
