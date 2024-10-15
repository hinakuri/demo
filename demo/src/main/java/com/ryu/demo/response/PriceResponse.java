package com.ryu.demo.response;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
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
	private Time create_time;
    private Time update_time;
    @JsonFormat(pattern = "yyyy-MM-dd" ,timezone="Asia/Tokyo")
    private Timestamp create_day;
    @JsonFormat(pattern = "yyyy-MM-dd" ,timezone="Asia/Tokyo")
    private Timestamp update_day;
}
