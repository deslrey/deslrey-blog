package org.deslrey;

import org.deslrey.mapper.ArticleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class DeslreyJavaApplicationTests {

    @Autowired
    private ArticleMapper articleMapper;

}
