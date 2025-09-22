package org.deslrey.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.deslrey.entity.po.Draft;
import org.deslrey.mapper.DraftMapper;
import org.deslrey.result.ResultCodeEnum;
import org.deslrey.result.Results;
import org.deslrey.service.DraftService;
import org.deslrey.util.NumberUtils;
import org.deslrey.util.StringUtils;
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
 * @since 2025/9/22 10:52
 */
@Service
public class DraftServiceImpl implements DraftService {

    @Autowired
    private DraftMapper draftMapper;

    @Override
    public Results<PageInfo<Draft>> draftList(int page, int pageSize) {
        PageHelper.startPage(page, pageSize);

        List<Draft> draftList = draftMapper.selectDraftList();
        if (draftList == null || draftList.isEmpty()) {
            draftList = new ArrayList<>();
        }
        PageInfo<Draft> draftPageInfo = new PageInfo<>(draftList);
        return Results.ok(draftPageInfo);
    }

    @Override
    public Results<Draft> DraftDetail(Integer id) {
        if (NumberUtils.isLessZero(id)) {
            return Results.fail(ResultCodeEnum.CODE_501);
        }

        Draft draft = draftMapper.selectDraftById(id);
        if (draft == null) {
            return Results.fail("获取草稿失败,暂无数据");
        }
        return Results.ok(draft);
    }

    @Override
    public Results<Void> addDraft(Draft draft) {
        if (draft == null) {
            return Results.fail(ResultCodeEnum.EMPTY_VALUE);
        }

        if (StringUtils.isBlank(draft.getTitle()) || StringUtils.isEmpty(draft.getContent()) || StringUtils.isEmpty(draft.getDes())) {
            return Results.fail(ResultCodeEnum.EMPTY_VALUE);
        }

        int result = draftMapper.insertDraft(draft);
        if (result > 0) {
            return Results.ok("草稿保存成功");
        }
        return Results.fail("草稿保存失败");
    }
}
