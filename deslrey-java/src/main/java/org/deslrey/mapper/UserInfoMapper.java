package org.deslrey.mapper;

import org.apache.ibatis.annotations.Param;
import org.deslrey.entity.po.UserInfo;

/**
 * <br>
 * 用户mapper
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/5 15:45
 */
public interface UserInfoMapper {
    UserInfo selectUserByName(String userName);

    int selectUserNameOrEmailExist(@Param("userName") String userName, @Param("email") String email);

    int insertUser(UserInfo user);

    int updateUserNameByName(@Param("oldUserName") String currentUsername, @Param("newUserName") String newName);
}
