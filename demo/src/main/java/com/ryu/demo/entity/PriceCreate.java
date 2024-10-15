package com.ryu.demo.entity;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor  //引数なしのコンストラクタを自動生成
@NoArgsConstructor //すべてのフィールドを引数に持つコンストラクタを自動生成
@Entity
@Table(name="prices")

public class PriceCreate {
	@Id
	@Column(name="employee_number")
	private  UUID employee_number;
	@Column(name="unit_price")
	private  int unit_price;
	@Column(name="start_date")
	private Date startdate;
	@Column(name="end_date")
	private Date enddate;
	@Column(name="create_day")
    private Timestamp create_day;
    @Column(name="create_time")
    private Time create_time;
    @Column(name="update_day")
    private Timestamp update_day;
    @Column(name="update_time")
    private Time update_time;
}
