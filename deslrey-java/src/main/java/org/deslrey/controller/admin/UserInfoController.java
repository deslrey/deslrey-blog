package org.deslrey.controller.admin;

import org.deslrey.entity.po.UserInfo;
import org.deslrey.entity.vo.UserTokenVO;
import org.deslrey.result.Results;
import org.deslrey.service.UserInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <br>
 * 用户控制层
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/5 16:47
 */
@RestController
@RequestMapping("user")
public class UserInfoController {

    @Autowired
    private UserInfoService userInfoService;

    @PostMapping("login")
    public Results<UserTokenVO> login(@RequestBody UserInfo userInfo) {
        return userInfoService.login(userInfo);
    }

    @PostMapping("register")
    public Results<Void> register(@RequestBody UserInfo userInfo) {
        return userInfoService.register(userInfo);
    }

    @PostMapping("updateUserName")
    public Results<Void> updateUserName(String oldName, String newName) {
        return userInfoService.updateUserName(oldName, newName);
    }

}
