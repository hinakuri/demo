package com.ryu.demo.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ProductResponse {
    private Integer id;
    private String itemName;
    private String category;

}
