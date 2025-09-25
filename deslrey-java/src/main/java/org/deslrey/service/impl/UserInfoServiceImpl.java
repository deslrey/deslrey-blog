package org.deslrey.service.impl;

import org.deslrey.convert.UserInfoConvert;
import org.deslrey.entity.po.UserInfo;
import org.deslrey.entity.vo.UserInfoVO;
import org.deslrey.entity.vo.UserTokenVO;
import org.deslrey.mapper.UserInfoMapper;
import org.deslrey.result.ResultCodeEnum;
import org.deslrey.result.Results;
import org.deslrey.service.UserInfoService;
import org.deslrey.util.JwtUtils;
import org.deslrey.util.PasswordUtils;
import org.deslrey.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * <br>
 * 用户接口实现类
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/5 16:40
 */
@Service
public class UserInfoServiceImpl implements UserInfoService {

    @Autowired
    private UserInfoMapper userInfoMapper;

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
        String hashed = PasswordUtils.hashPassword(userInfo.getPassWord(), salt);
        boolean isValid = PasswordUtils.verifyPassword(userInfo.getPassWord(), salt, hashed);

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
}


