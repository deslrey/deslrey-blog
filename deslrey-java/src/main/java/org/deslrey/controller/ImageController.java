package org.deslrey.controller;

import com.github.pagehelper.PageInfo;
import org.deslrey.annotation.RequireLogin;
import org.deslrey.entity.vo.ImageVO;
import org.deslrey.result.Results;
import org.deslrey.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * <br>
 * 图片控制器
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/23 9:45
 */
@RestController
@RequestMapping("/image")
public class ImageController {

    @Autowired
    private ImageService imageService;

    @RequireLogin
    @GetMapping("list")
    public Results<PageInfo<ImageVO>> imageList(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "5") int pageSize) {
        return imageService.imageList(page, pageSize);
    }

    @RequireLogin
    @PostMapping("uploadImage")
    public Results<String> uploadImage(@RequestParam("file") MultipartFile file, @RequestParam("folderId") Integer folderId) {
        return imageService.uploadImage(file, folderId);
    }

    @RequireLogin
    @GetMapping("obscure")
    public Results<List<ImageVO>> obscureFolderName(String folderName) {
        return imageService.obscureFolderName(folderName);
    }

    @RequireLogin
    @DeleteMapping("/deleteImage/{imageId}")
    public Results<Void> deleteImage(@PathVariable Integer imageId) {
        return imageService.deleteImage(imageId);
    }

}
