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
@Table(name="Product")
public class Product {
    @Id
    @Column(name="id")
    private Integer id;
    @Column(name="itemname")
    private String itemname;
    @Column(name="category",nullable = false)
    private String category;
    @Override
    public String toString(){
        return "item_name: "+itemname+", category: "+category;
    }

}
