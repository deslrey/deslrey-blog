package org.deslrey.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.extern.slf4j.Slf4j;
import org.deslrey.entity.po.Folder;
import org.deslrey.entity.po.Image;
import org.deslrey.entity.vo.ImageVO;
import org.deslrey.mapper.FolderMapper;
import org.deslrey.mapper.ImageMapper;
import org.deslrey.result.ResultCodeEnum;
import org.deslrey.result.Results;
import org.deslrey.service.ImageService;
import org.deslrey.util.ImageUtils;
import org.deslrey.util.NumberUtils;
import org.deslrey.util.StaticUtils;
import org.deslrey.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

/**
 * <br>
 * 图片接口实现类
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/16 16:05
 */
@Slf4j
@Service
public class ImageServiceImpl implements ImageService {

    @Autowired
    private ImageMapper imageMapper;

    @Autowired
    private FolderMapper folderMapper;

    @Value("${custom.static-source-path}")
    private String folderPath;

    @Override
    public Results<Void> uploadImage(MultipartFile file, Integer folderId) {
        if (file == null || file.isEmpty()) {
            log.error("上传图片为空");
            return Results.fail(ResultCodeEnum.EMPTY_VALUE);
        }
        if (NumberUtils.isLessZero(folderId)) {
            log.error("上传图片对应文件夹ID非法 ======> {}", folderId);
            return Results.fail(ResultCodeEnum.CODE_501);
        }

        Folder folder = folderMapper.selectById(folderId);
        if (folder == null) {
            return Results.fail(ResultCodeEnum.CODE_501);
        }

        try {
            File saveMultipartFile = ImageUtils.saveMultipartFile(file, folderPath + File.separator + folder.getPath());
            String accessUrl = ImageUtils.toAccessUrl(saveMultipartFile, folderPath);
            if (StringUtils.isEmpty(accessUrl)) {
                log.error("图片存储链接返回空值");
                return Results.fail(ResultCodeEnum.CODE_500);
            }

            Image image = new Image();
            image.setFolderId(folderId);
            image.setImageName(saveMultipartFile.getName());
            image.setPath(saveMultipartFile.getPath());
            image.setUrl(accessUrl);
            image.setSize(saveMultipartFile.length());

            int result = imageMapper.insertImage(image);
            if (result > 0) {
                return Results.ok("上传成功");
            }
            return Results.fail("上传失败");
        } catch (IOException e) {
            log.error("保存图片上传出现异常 ======> {}", e.getMessage());
            return Results.fail("上床失败");
        }

    }

    @Override
    public Results<PageInfo<ImageVO>> imageList(String type, int page, int pageSize) {
        PageHelper.startPage(page, pageSize);
        List<ImageVO> imageList;
        if (StringUtils.isEmpty(type) || StaticUtils.ALL_TYPE.equals(type)) {
            imageList = imageMapper.allList();
        } else {
            imageList = imageMapper.modicumList();
        }
        PageInfo<ImageVO> imageVOPageInfo = new PageInfo<>(imageList);
        return Results.ok(imageVOPageInfo);
    }
}
