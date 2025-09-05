package org.deslrey;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("org.deslrey.mapper")
public class DeslreyJavaApplication {

    public static void main(String[] args) {
        SpringApplication.run(DeslreyJavaApplication.class, args);
    }

}
