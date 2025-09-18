package org.deslrey.controller.admin;

import org.deslrey.result.Results;
import org.deslrey.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
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

}
