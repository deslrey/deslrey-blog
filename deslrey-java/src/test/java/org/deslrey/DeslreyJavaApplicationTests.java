package org.deslrey;

import org.deslrey.entity.po.Article;
import org.deslrey.mapper.ArticleMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class DeslreyJavaApplicationTests {

    @Autowired
    private ArticleMapper articleMapper;

    @Test
    void name() {
        List<Article> all = articleMapper.getAll();
        System.out.println("all = " + all);
    }
}
