package com.ryu.demo.request;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class ProductCreateRequest {
    private Integer id;
    private String itemName;
    private String category;
}
