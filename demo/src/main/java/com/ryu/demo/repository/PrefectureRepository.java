package com.ryu.demo.repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ryu.demo.entity.Prefecture;

@Transactional
@Repository
public interface PrefectureRepository extends JpaRepository<Prefecture, String> {
    void deleteById(String prefecture_code);
}
	
