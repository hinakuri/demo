package com.ryu.demo.repository;

import com.ryu.demo.entity.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Transactional
@Repository
public interface TestRepository extends JpaRepository<Test, String> {
    //List<Test> getTests();
}
