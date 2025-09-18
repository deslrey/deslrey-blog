package org.deslrey.service;

import org.deslrey.entity.po.Tag;
import org.deslrey.entity.vo.TagCountVO;
import org.deslrey.result.Results;

import java.util.List;

/**
 * <br>
 * 标签接口
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/15 11:43
 */
public interface TagService {
    Results<List<TagCountVO>> tagList();

    Results<List<Tag>> tagNameList();
}
