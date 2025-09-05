package org.deslrey.mapper;

import org.deslrey.entity.vo.LatestReleasesVO;

import java.util.List;

/**
 * <br>
 * 文章mapper
 * </br>
 *
 * @author deslrey
 * @version 1.0
 * @since 2025/9/5 15:38
 */
public interface ArticleMapper {

    List<LatestReleasesVO> latestReleases();
}
