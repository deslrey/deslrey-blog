package org.deslrey.service;

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
}
