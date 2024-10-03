package com.ryu.demo.response;

import java.sql.Date;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PriceResponse {
	private UUID employee_number;
	private int unit_price;
	@JsonFormat(pattern = "yyyy-MM-dd" ,timezone="Asia/Tokyo")
	private Date start_date;
	@JsonFormat(pattern = "yyyy-MM-dd" ,timezone="Asia/Tokyo")
	private Date end_date;
	private int id;
	private int delete_flag;
}
