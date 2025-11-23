package org.deslrey.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.extern.slf4j.Slf4j;
import org.deslrey.entity.po.Draft;
import org.deslrey.mapper.DraftMapper;
import org.deslrey.result.Results;
import org.deslrey.service.DraftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * <br>
 * 草稿接口实现类
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/23 11:41
 */
@Slf4j
@Service
public class DraftServiceImpl implements DraftService {

    @Autowired
    private DraftMapper draftMapper;

    @Override
    public Results<PageInfo<Draft>> draftList(int page, int pageSize) {
        PageHelper.startPage(page, pageSize);

        List<Draft> draftList = draftMapper.selectDraftList();
        if (draftList == null || draftList.isEmpty()) {
            draftList = new ArrayList<>(0);
        }
        PageInfo<Draft> draftPageInfo = new PageInfo<>(draftList);
        return Results.ok(draftPageInfo);
    }
}
