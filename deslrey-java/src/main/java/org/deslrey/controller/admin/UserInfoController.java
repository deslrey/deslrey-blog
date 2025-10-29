package org.deslrey.controller.admin;

import org.deslrey.annotation.RequireLogin;
import org.deslrey.entity.po.UserInfo;
import org.deslrey.entity.vo.UserTokenVO;
import org.deslrey.result.Results;
import org.deslrey.service.UserInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @RequireLogin
    @PostMapping("updateUserName")
    public Results<Void> updateUserName(String oldName, String newName) {
        return userInfoService.updateUserName(oldName, newName);
    }

    @RequireLogin
    @PostMapping("updateUserAvatar")
    public Results<String> updateUserAvatar(@RequestParam("file") MultipartFile file) {
        return userInfoService.updateUserAvatar(file);
    }

    @RequireLogin
    @PostMapping("updatePassword")
    public Results<Void> updatePassword(String olbPassWord, String newPassWord) {
        return userInfoService.updatePassword(olbPassWord, newPassWord);
    }
}
