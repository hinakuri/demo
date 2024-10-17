package com.ryu.demo.entity;

import java.sql.Time;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor  //引数なしのコンストラクタを自動生成
@NoArgsConstructor //すべてのフィールドを引数に持つコンストラクタを自動生成
@Entity
@Table(name="salarys")
public class Salaryrespo {
	 @Id
	 	@NotNull(message="社員番号を入力してください。")
	    @Column(name="employee_number")
	    private  UUID employee_number;
	 	@NotNull(message="月を入力してください。")
	    @Column(name="month_day")
	    private String month_day;
	    @Column(name="unit_price")
	    private int unit_price;
	    @NotNull(message="働いた時間を入力してください。")
	    @Column(name="work_time")
	    private double work_time;
	    @Column(name="amount_money")
	    private int amount_money;
	    @JoinColumn(name ="employee_number",insertable=false,updatable=false)
	    @Column(name="working_days")
	    private int working_days;
	    @Column(name="holiday")
	    private int holiday;
	    @Column(name="create_day")
	    private String create_day;
	    @Column(name="create_time")
	    private Time create_time;
	    @Column(name="update_day")
	    private String update_day;
	    @Column(name="update_time")
	    private Time update_time;
	    @Column(name="employee_name")
	    private String employee_name;
}
