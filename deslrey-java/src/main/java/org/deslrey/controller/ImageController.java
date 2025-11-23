package org.deslrey.controller;

import com.github.pagehelper.PageInfo;
import org.deslrey.entity.vo.ImageVO;
import org.deslrey.result.Results;
import org.deslrey.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping("list")
    public Results<PageInfo<ImageVO>> imageList(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "5") int pageSize) {
        return imageService.imageList(page, pageSize);
    }

}
