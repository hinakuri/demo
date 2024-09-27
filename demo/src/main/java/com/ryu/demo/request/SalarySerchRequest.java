package com.ryu.demo.request;

import lombok.Data;

@Data
public class SalarySerchRequest {
    private String month;
    private String day;
    private String employee_number;
}
