package com.ryu.demo.request;

import java.sql.Time;
import java.sql.Timestamp;
import java.util.UUID;

import lombok.Data;
import lombok.ToString;

@Data
@ToString

public class SalaryCreateRequest {
	 private UUID employee_number;
	    private String month_day;
	    private String month;
	    private String day;
	    private String unit_price;
	    private double work_time;
	    private int working_days;
	    private int holiday;
	    private Timestamp create_day;
	    private Time create_time;
	    private Timestamp update_day;
	    private Time update_time;
	    
}
