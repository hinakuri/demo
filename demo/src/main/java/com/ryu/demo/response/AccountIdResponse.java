package com.ryu.demo.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AccountIdResponse {
	private String employee_number;
}
