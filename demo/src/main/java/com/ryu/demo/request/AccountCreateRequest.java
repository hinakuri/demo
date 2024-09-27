package com.ryu.demo.request;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.UUID;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class AccountCreateRequest {
	 private UUID employee_number;
	    private String employee_first_name;
	    private String employee_last_name;
	    private Date employment_start_date;
	    private String prefecture_code;
	    private Timestamp cleate_day;
	    private Time cleate_time;
	    private Timestamp update;
	    private Time update_time;
	    private int classification;
}
