package org.deslrey.service.impl;

import org.deslrey.entity.vo.TagCountVO;
import org.deslrey.mapper.TagMapper;
import org.deslrey.result.Results;
import org.deslrey.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * <br>
 * 标签接口实现类
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/15 11:44
 */
@Service
public class TagServiceImpl implements TagService {

    @Autowired
    private TagMapper tagMapper;

    @Override
    public Results<List<TagCountVO>> tagList() {
        List<TagCountVO> tagCountVOList = tagMapper.tagList();
        if (tagCountVOList == null || tagCountVOList.isEmpty()) {
            return Results.ok(new ArrayList<>());
        }
        return Results.ok(tagCountVOList);
    }
}
