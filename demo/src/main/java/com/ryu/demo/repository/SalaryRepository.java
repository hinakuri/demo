package com.ryu.demo.repository;

import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.ryu.demo.entity.Salary;

@Transactional
@Repository
public interface SalaryRepository extends JpaRepository<Salary,UUID>,JpaSpecificationExecutor<Salary> {
    void deleteById(UUID uuid);
    List<Salary> findBymonthdayEquals(String monthday);
    List<Salary> findBymonthdayContaining(String monthday);
}
