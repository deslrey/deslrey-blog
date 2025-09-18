package org.deslrey.controller.admin;

import com.github.pagehelper.PageInfo;
import org.deslrey.entity.vo.ImageVO;
import org.deslrey.result.Results;
import org.deslrey.service.ImageService;
import org.deslrey.util.StaticUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * <br>
 * 图片控制器
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/16 16:04
 */
@RestController
@RequestMapping("image")
public class ImageController {

    @Autowired
    private ImageService imageService;

    @PostMapping("uploadImage")
    public Results<Void> uploadImage(@RequestParam("file") MultipartFile file, @RequestParam("folderId") Integer folderId) {
        return imageService.uploadImage(file, folderId);
    }

    @GetMapping("list")
    public Results<PageInfo<ImageVO>> imageList(@RequestParam(defaultValue = StaticUtils.ALL_TYPE) String type, @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "5") int pageSize) {
        return imageService.imageList(type, page, pageSize);
    }
}
