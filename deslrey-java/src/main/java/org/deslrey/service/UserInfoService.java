package org.deslrey.service;

import org.deslrey.entity.po.UserInfo;
import org.deslrey.entity.vo.UserTokenVO;
import org.deslrey.result.Results;

/**
 * <br>
 * 用户接口
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/11/22 17:27
 */
public interface UserInfoService {
    Results<UserTokenVO> login(UserInfo userInfo);
}
