package com.ryu.demo.request;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
 public class PrefectureCreateRequest {
    private String prefecture_code;
    private String prefecture_name;


}
