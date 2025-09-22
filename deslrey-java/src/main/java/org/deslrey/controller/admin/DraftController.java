package org.deslrey.controller.admin;

import org.deslrey.service.DraftService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <br>
 * 草稿控制器
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/22 10:51
 */
@RestController
@RequestMapping("admin/draft")
public class DraftController {

    @Autowired
    private DraftService draftService;


}
