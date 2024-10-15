package com.ryu.demo.repository;

import java.sql.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ryu.demo.entity.Price;

public interface PriceRepository extends JpaRepository<Price,Integer> {
	void deleteById(int id);
	List<Price> findBydeleteflagEquals(int age);
	List<Price> findByEmployeenumberAndStartdateLessThanEqualAndEnddateGreaterThanEqual
    (UUID employee_number,Date startdate ,Date enddate);
	
}
