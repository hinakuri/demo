package com.ryu.demo.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;

import lombok.val;

@Configuration //JavaConfigに付与する
public class MvcConfig extends WebMvcConfigurationSupport {

    @Bean  //JavaConfig内のインスタンスを生成するメソッド
    public HttpMessageConverter converter(){
        val objectMapper= Jackson2ObjectMapperBuilder.json().propertyNamingStrategy(new PropertyNamingStrategy.SnakeCaseStrategy()).build();
        return new MappingJackson2HttpMessageConverter(objectMapper);
    }
    @Override //Overrideの宣言
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters){
        converters.add(converter());
        addDefaultHttpMessageConverters(converters);

    }

}
