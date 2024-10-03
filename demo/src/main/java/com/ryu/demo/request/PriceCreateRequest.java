package com.ryu.demo.request;

import java.sql.Date;
import java.util.UUID;

import lombok.Data;
import lombok.ToString;
@Data
@ToString
public class PriceCreateRequest {
	private UUID employee_number;
	private int unit_price;
	private Date start_date;
	private Date end_date;
	private int delete_flag;
	private int id;
	
}
