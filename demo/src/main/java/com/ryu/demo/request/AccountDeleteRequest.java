package com.ryu.demo.request;

import java.sql.Date;
import java.sql.Time;
import java.util.UUID;

import lombok.Data;

@Data
public class AccountDeleteRequest {
    private UUID employee_number;
    private String employee_first_name;
    private String employee_last_name;
    private Date employment_start_date;
    private String prefecture_code;
    private Date cleate_day;
    private Time cleate_time;
    private Date update;
    private Time update_time;
    private int classification;
    
}
