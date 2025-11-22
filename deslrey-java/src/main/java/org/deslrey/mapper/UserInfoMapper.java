package org.deslrey.mapper;

import org.deslrey.entity.po.UserInfo;

/**
 * <br>
 *
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/22 17:28
 */
public interface UserInfoMapper {
    UserInfo selectUserByName(String userName);

    int selectUserNameOrEmailExist(String userName, String email);

    int insertUser(UserInfo user);
}
