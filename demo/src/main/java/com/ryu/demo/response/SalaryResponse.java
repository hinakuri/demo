package com.ryu.demo.response;

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
public class SalaryResponse {
    private String month_day;
	private String employee_name;
	private UUID employee_number;
    private String unit_price;
    private double work_time;
    private String amount_money;
    private int working_days;
    private int holiday;
    private Time create_time;
    private Time update_time;
    @JsonFormat(pattern = "yyyy-MM-dd" ,timezone="Asia/Tokyo")
    private Timestamp create_day;
    @JsonFormat(pattern = "yyyy-MM-dd" ,timezone="Asia/Tokyo")
    private Timestamp update_day;
}
