package com.ryu.demo.response;


import java.sql.Date;
import java.sql.Time;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AccountResponse {
    private String employee_number;
    private String employee_first_name;
    private String employee_last_name;
    private String employment_start_date;
    private String prefecture_name;
    private Time create_time;
    private Time update_time;
    private int validity_flag;
    @JsonFormat(pattern = "yyyy-MM-dd" ,timezone="Asia/Tokyo")
    private Date create_day;
    @JsonFormat(pattern = "yyyy-MM-dd" ,timezone="Asia/Tokyo")
    private Date update;
    
    
    
}
