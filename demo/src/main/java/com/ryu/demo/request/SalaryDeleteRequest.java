package com.ryu.demo.request;

import java.sql.Date;
import java.util.UUID;

import lombok.Data;
import lombok.ToString;

@Data
@ToString

public class SalaryDeleteRequest {
	private UUID employee_number;
	private Date month_day;
	private int unit_price;
	private double work_time;
	private int amount_money;
	private int working_days;
	private int holiday;
}
