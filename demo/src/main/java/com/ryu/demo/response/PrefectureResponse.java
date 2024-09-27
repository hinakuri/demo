package com.ryu.demo.response;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PrefectureResponse {
    private String prefecture_code;
    private String prefecture_name;
}