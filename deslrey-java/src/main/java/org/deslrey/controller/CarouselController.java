package org.deslrey.controller;

import org.deslrey.result.Results;
import org.deslrey.util.StaticUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.ThreadLocalRandom;

/**
 * <br>
 * 图片控制器
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/10/21 9:52
 */
@RestController
@RequestMapping("/carousel")
public class CarouselController {

    @Value("${carousel.sex-api}")
    private String sexImagePath;

    @Value("${carousel.scenery-api}")
    private String sceneryImagePath;

//    private static final String sexImagePath = StaticUtils.BASE_URL + "bg/sex/";

//    private static final String sceneryImagePath = StaticUtils.BASE_URL + "bg/scenery/";

    private static final int sexSum = 2401;
    private static final int scenerySum = 1600;

    @GetMapping("sex")
    public Results<String> sexImage() {
        int randomNumber = ThreadLocalRandom.current().nextInt(1, sexSum + 1);
        String imageUrl = sexImagePath + "img" + randomNumber + ".webp";
        return Results.ok(imageUrl, "成功");
    }

    @GetMapping("scenery")
    public Results<String> sceneryImage() {
        int randomNumber = ThreadLocalRandom.current().nextInt(1, scenerySum + 1);
        String imageUrl = sceneryImagePath + "img" + randomNumber + ".jpg";
        return Results.ok(imageUrl, "成功");
    }
}
