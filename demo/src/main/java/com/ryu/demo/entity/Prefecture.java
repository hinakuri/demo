package com.ryu.demo.entity;

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
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="m_prefecture")
public class Prefecture {
    @Id
    @Column(name="prefecture_code")
    private String prefecture_code;
    
    @Column(name="prefecture_name")
    private String prefecture_name ;
    
    @Override
    public String toString(){
        return "prefecture_code: "+prefecture_code+", prefecture_name: "+prefecture_name;
    }

}
