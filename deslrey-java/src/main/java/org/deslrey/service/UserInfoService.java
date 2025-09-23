package org.deslrey.service;

import org.deslrey.entity.po.UserInfo;
import org.deslrey.entity.vo.UserInfoVO;
import org.deslrey.result.Results;

/**
 * <br>
 * 用户接口
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/5 16:39
 */
public interface UserInfoService {
    Results<UserInfoVO> login(UserInfo userInfo);

    Results<Void> register(UserInfo userInfo);
}
