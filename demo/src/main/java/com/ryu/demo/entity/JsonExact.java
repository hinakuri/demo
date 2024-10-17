package com.ryu.demo.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor  //引数なしのコンストラクタを自動生成
@NoArgsConstructor //すべてのフィールドを引数に持つコンストラクタを自動生成
public class JsonExact {
	@JsonProperty("month_day")
	private String monthDay;
	@JsonProperty("employee_name")
	private String employeeName;
	@JsonProperty("employee_number")
	private String employeeNumber;
	@JsonProperty("unit_price")
	private String unitPrice;
	@JsonProperty("work_time")
	private double workTime;
	@JsonProperty("amount_money")
	private String amountMoney;
	@JsonProperty("working_days")
	private int workingDays;
	@JsonProperty("holiday")
	private int holiday;
	@JsonProperty("create_time")
	private String createTime;
	@JsonProperty("update_time")
	private String updateTime;
	@JsonProperty("create_day")
	private String createDay;
	@JsonProperty("update_day")
	private String updateDay;
}
