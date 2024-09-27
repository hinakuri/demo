package com.ryu.demo.entity;

import java.sql.Time;
import java.sql.Timestamp;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
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
public class Salary {
	 @Id
	 	@NotNull(message="社員番号を入力してください。")
	    @Column(name="employee_number")
	    private  UUID employeenumber;
	 	@NotNull(message="月を入力してください。")
	    @Column(name="month_day")
	    private String monthday;
	    @Column(name="unit_price")
	    private int unitprice;
	    @NotNull(message="働いた時間を入力してください。")
	    @Column(name="work_time")
	    private double worktime;
	    @Column(name="amount_money")
	    private int amountmoney;
	    @OneToOne
	    @JoinColumn(name ="employee_number",insertable=false,updatable=false)
	    private Account account; 
	    
	    @Column(name="working_days")
	    private int workingdays;
	    @Column(name="holiday")
	    private int holiday;
	    @Column(name="create_day")
	    private Timestamp create_day;
	    @Column(name="create_time")
	    private Time create_time;
	    @Column(name="update_day")
	    private Timestamp update_day;
	    @Column(name="update_time")
	    private Time update_time;
}
