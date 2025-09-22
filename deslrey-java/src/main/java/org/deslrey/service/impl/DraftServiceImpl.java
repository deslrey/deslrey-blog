package org.deslrey.service.impl;

import org.deslrey.mapper.DraftMapper;
import org.deslrey.service.DraftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * <br>
 * 草稿接口实现类
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/22 10:52
 */
@Service
public class DraftServiceImpl implements DraftService {

    @Autowired
    private DraftMapper draftMapper;

}
