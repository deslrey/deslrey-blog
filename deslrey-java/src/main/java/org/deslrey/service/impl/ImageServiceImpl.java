package org.deslrey.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.extern.slf4j.Slf4j;
import org.deslrey.entity.vo.ImageVO;
import org.deslrey.mapper.ImageMapper;
import org.deslrey.result.Results;
import org.deslrey.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <br>
 * 图片接口实现类
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/23 9:46
 */
@Slf4j
@Service
public class ImageServiceImpl implements ImageService {

    @Autowired
    private ImageMapper imageMapper;

    @Override
    public Results<PageInfo<ImageVO>> imageList(int page, int pageSize) {
        if (page < 1)
            page = 1;
        if (pageSize < 1)
            pageSize = 1;
        PageHelper.startPage(page, pageSize);
        List<ImageVO> imageList = imageMapper.selectList();
        PageInfo<ImageVO> imagePageInfo = new PageInfo<>(imageList);
        return Results.ok(imagePageInfo);
    }
}
