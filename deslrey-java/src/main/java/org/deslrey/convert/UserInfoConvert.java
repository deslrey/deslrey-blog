package org.deslrey.convert;

import org.deslrey.entity.po.UserInfo;
import org.deslrey.entity.vo.UserInfoVO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

/**
 * <br>
 * 用户实体类相互转换
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/23 9:12
 */
@Mapper(componentModel = "spring")
public interface UserInfoConvert {

    UserInfoConvert INSTANCE = Mappers.getMapper(UserInfoConvert.class);

    UserInfo convert(UserInfoVO vo);

    UserInfoVO convert(UserInfo userInfo);

}
