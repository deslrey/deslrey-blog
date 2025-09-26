package org.deslrey.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.deslrey.entity.po.UserInfo;
import org.deslrey.entity.vo.UserTokenVO;
import org.deslrey.mapper.UserInfoMapper;
import org.deslrey.result.ResultCodeEnum;
import org.deslrey.result.Results;
import org.deslrey.service.UserInfoService;
import org.deslrey.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Objects;

/**
 * <br>
 * 用户接口实现类
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/5 16:40
 */
@Slf4j
@Service
public class UserInfoServiceImpl implements UserInfoService {

    @Autowired
    private UserInfoMapper userInfoMapper;

    @Value("${custom.static-source-path}")
    private String folderPath;

    @Override
    public Results<UserTokenVO> login(UserInfo userInfo) {
        if (userInfo == null) {
            return Results.fail(ResultCodeEnum.CODE_501);
        }
        if (StringUtils.isBlank(userInfo.getUserName())) {
            return Results.fail("用户名不能为空");
        }
        if (StringUtils.isBlank(userInfo.getPassWord())) {
            return Results.fail("密码不能为空");
        }

        UserInfo user = userInfoMapper.selectUserByName(userInfo.getUserName());
        if (user == null) {
            return Results.fail("登陆失败,该用户不存在");
        }

        String salt = user.getSalt();
        String storedHash = user.getPassWord();
        boolean isValid = PasswordUtils.verifyPassword(userInfo.getPassWord(), salt, storedHash);
        if (!isValid) {
            return Results.fail("登陆失败,密码错误");
        }

        String token = JwtUtils.generateToken(user.getUserName());
        if (StringUtils.isBlank(token)) {
            return Results.fail("登陆失败,token生成错误");
        }
        UserTokenVO userTokenVO = new UserTokenVO();
        userTokenVO.setUserName(user.getUserName());
        userTokenVO.setEmail(user.getEmail());
        userTokenVO.setToken(token);
        userTokenVO.setAvatar(user.getAvatar());

        return Results.ok(userTokenVO, "登陆成功");
    }

    @Override
    public Results<Void> register(UserInfo userInfo) {
        if (userInfo == null) {
            return Results.fail(ResultCodeEnum.CODE_501);
        }
        if (StringUtils.isBlank(userInfo.getUserName()) || StringUtils.isBlank(userInfo.getEmail())) {
            return Results.fail("用户名或邮箱不能为空");
        }
        if (StringUtils.isBlank(userInfo.getPassWord())) {
            return Results.fail("密码不能为空");
        }

        int result = userInfoMapper.selectUserNameOrEmailExist(userInfo.getUserName(), userInfo.getEmail());
        if (result > 0) {
            return Results.fail(ResultCodeEnum.ACCOUNT_EXIST);
        }

        String salt = PasswordUtils.generateSalt();
        String hashPassword = PasswordUtils.hashPassword(userInfo.getPassWord(), salt);

        UserInfo user = new UserInfo();
        user.setUserName(userInfo.getUserName());
        user.setPassWord(hashPassword);
        user.setEmail(userInfo.getEmail());
        user.setSalt(salt);
        user.setExist(true);

        result = userInfoMapper.insertUser(user);
        if (result > 0) {
            return Results.ok("注册成功");
        }
        return Results.fail("注册失败");
    }

    @Override
    public Results<Void> updateUserName(String oldName, String newName) {
        if (StringUtils.isBlank(oldName) || StringUtils.isBlank(newName)) {
            return Results.fail(ResultCodeEnum.CODE_501);
        }

        String currentUsername = AuthUtils.getCurrentUsername();
        if (StringUtils.isBlank(currentUsername)) {
            return Results.fail(ResultCodeEnum.CODE_401);
        }

        if (Objects.equals(oldName, newName)) {
            return Results.fail("修改失败,新用户名和旧用户名相同");
        }

        if (!Objects.equals(oldName, currentUsername)) {
            return Results.fail(ResultCodeEnum.CODE_401);
        }

        int result = userInfoMapper.updateUserNameByName(currentUsername, newName);

        if (result > 0) {
            return Results.ok("修改成功");
        }
        return Results.fail("修改失败");

    }

    @Override
    public Results<String> updateUserAvatar(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return Results.fail("上传头像为空");
        }

        String currentUsername = AuthUtils.getCurrentUsername();
        if (StringUtils.isBlank(currentUsername)) {
            return Results.fail(ResultCodeEnum.CODE_401);
        }

        Integer userId = userInfoMapper.selectUserIdByName(currentUsername);
        if (userId == null) {
            return Results.fail(ResultCodeEnum.CODE_401);
        }

        try {
            File saveMultipartFile = ImageUtils.saveMultipartFile(file, folderPath + File.separator + userId);
            String accessUrl = ImageUtils.toAccessUrl(saveMultipartFile, folderPath);
            if (StringUtils.isEmpty(accessUrl)) {
                return Results.fail(ResultCodeEnum.CODE_500);
            }

            UserInfo userInfo = userInfoMapper.selectUserById(userId);
            if (userInfo == null) {
                return Results.fail("更新失败,暂无当前用户");
            }

            int result = userInfoMapper.updateUserAvatar(accessUrl, userId);
            if (result > 0) {
                return Results.ok(accessUrl, "更新成功");
            }
            return Results.fail("更新失败");
        } catch (IOException e) {
            log.error("更新头像出现异常 ======> {}", e.getMessage());
            return Results.fail("头像更新失败");
        }
    }

    @Override
    public Results<Void> updatePassword(String olbPassWord, String newPassWord) {
        if (StringUtils.isBlank(olbPassWord) || StringUtils.isBlank(newPassWord)) {
            return Results.fail("密码不能存在空");
        }

        if (Objects.equals(olbPassWord, newPassWord)) {
            return Results.fail("新密码不能与旧密码相同");
        }

        String currentUsername = AuthUtils.getCurrentUsername();
        if (StringUtils.isEmpty(currentUsername)) {
            return Results.fail(ResultCodeEnum.CODE_401);
        }

        UserInfo userInfo = userInfoMapper.selectUserByName(currentUsername);
        if (userInfo == null) {
            return Results.fail("修改失密码败,该用户不存在");
        }

        String salt = userInfo.getSalt();

        String oldHashPassword = PasswordUtils.hashPassword(olbPassWord, salt);
        if (StringUtils.isEmpty(oldHashPassword)) {
            return Results.fail(ResultCodeEnum.CODE_500);
        }

        if (!Objects.equals(oldHashPassword, userInfo.getPassWord())) {
            return Results.fail("旧密码错误");
        }

        String newHashedPassword = PasswordUtils.hashPassword(newPassWord, salt);
        if (StringUtils.isEmpty(newHashedPassword)) {
            return Results.fail(ResultCodeEnum.CODE_500);
        }

        if (Objects.equals(newHashedPassword, userInfo.getPassWord())) {
            return Results.fail("新密码不能与旧密码相同");
        }

        int result = userInfoMapper.updatePassWord(newHashedPassword, userInfo.getId());

        if (result > 0) {
            return Results.ok("密码修改成功");
        }
        return Results.fail("密码修改失败");
    }
}


