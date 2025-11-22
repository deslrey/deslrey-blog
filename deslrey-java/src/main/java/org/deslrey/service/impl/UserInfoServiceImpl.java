package org.deslrey.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.deslrey.entity.po.UserInfo;
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
 * @since 2025/11/22 17:27
 */
@Slf4j
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
            return Results.fail("登陆失败,用户不存在");
        }

        if (user.getExist() != null && !user.getExist()) {
            return Results.fail("登陆失败,用户已被禁用");
        }

        String salt = user.getSalt();
        String passWord = user.getPassWord();
        boolean verified = PasswordUtils.verifyPassword(userInfo.getPassWord(), salt, passWord);
        if (!verified) {
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
}
