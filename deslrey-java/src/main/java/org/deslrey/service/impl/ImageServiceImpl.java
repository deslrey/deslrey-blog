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
import org.deslrey.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
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

    @Autowired
    private FolderMapper folderMapper;

    @Value("${custom.static-source-path}")
    private String folderPath;

    @Value("${custom.url}")
    private String urlPath;

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

    @Override
    public Results<String> uploadImage(MultipartFile file, Integer folderId) {
        if (file == null || file.isEmpty()) {
            log.error("上传图片为空");
            return Results.fail(ResultCodeEnum.EMPTY_VALUE);
        }

        if (NumberUtils.isLessZero(folderId)) {
            log.error("上传图片对应文件夹ID非法 ======> {}", folderId);
            return Results.fail(ResultCodeEnum.CODE_501);
        }

        Folder folder = folderMapper.selectFolderById(folderId);
        if (folder == null) {
            log.error("上传位置不存在");
            return Results.fail(ResultCodeEnum.CODE_501);
        }

        try {
            String originalFileName = file.getOriginalFilename();
            String generatedNewImageName = ImageUtils.generateNewImageName(originalFileName);
            // 保存文件
            File savedFile = ImageUtils.saveMultipartFile(file,
                    folderPath + File.separator + folder.getPath(),
                    generatedNewImageName);

            Image image = new Image();
            image.setFolderId(folderId);
            image.setImageName(generatedNewImageName);
            image.setOriginalName(originalFileName);
            image.setPath(folder.getPath());
            image.setUrl("/" + generatedNewImageName);
            image.setSize(savedFile.length());

            int result = imageMapper.insertImage(image);
            if (result > 0) {
                return Results.ok(image.getPath() + image.getUrl(), "上传成功");
            }
            return Results.fail("上传失败");
        } catch (IOException e) {
            log.error("保存图片上传出现异常 ======> {}", e.getMessage());
            return Results.fail("上传失败");
        }
    }


    @Override
    public Results<List<ImageVO>> obscureFolderName(String folderName) {
        if (StringUtils.isEmpty(folderName)) {
            return Results.ok(new ArrayList<>(0));
        }
        List<ImageVO> imageList = imageMapper.selectObscureFolderName(folderName);
        return Results.ok(imageList);
    }
}
