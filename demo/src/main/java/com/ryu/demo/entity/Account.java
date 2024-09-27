package com.ryu.demo.entity;

import java.sql.Date;
import java.sql.Time;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
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
@Table(name="employees")

public class Account {
	
    @Id
    @Column(name="employee_number")
    private  UUID employee_number;
    @Column(name="employee_first_name")
    private String employee_first_name;
    @Column(name="employee_last_name")
    private String employee_last_name;
    @Column(name="employment_start_date")
    private Date employment_start_date;
    @Column(name="prefecture_code")
    private String prefecture_code;
    @OneToOne
    @JoinColumn(name = "prefecture_code",insertable=false,updatable=false)
    private Prefecture prefecture; 
    @Column(name="create_day")
    private Date create_day;
    @Column(name="create_time")
    private Time create_time;
    @Column(name="update")
    private Date update;
    @Column(name="update_time")
    private Time update_time;
    @Column(name="validity_flag")
    private int validityflag;
    
    
    @Override
    public String toString(){
        return "number: "+employee_number+", first_name: "+employee_first_name+", last_name: "+employee_last_name
        		+ "prefecture_code: " + prefecture_code + "create_day: " + create_day + "create_time" + 
        		create_time + "update_day" +  update + "update_time" + update_time + "validity_flag" + validityflag;
    }

}