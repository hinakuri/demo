package com.ryu.demo.request;

import lombok.Data;

@Data
public class SalaryUnitPriceRequest {
	private String employee_number;
	private String year;
	private String month;

}
