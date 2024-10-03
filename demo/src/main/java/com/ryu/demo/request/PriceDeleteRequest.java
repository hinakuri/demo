package com.ryu.demo.request;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class PriceDeleteRequest {
	private int delete_flag;
}
