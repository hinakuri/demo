package com.ryu.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ryu.demo.entity.Price;

public interface PriceRepository extends JpaRepository<Price,Integer> {
	void deleteById(int id);
	List<Price> findBydeleteflagEquals(int age);
	
}
