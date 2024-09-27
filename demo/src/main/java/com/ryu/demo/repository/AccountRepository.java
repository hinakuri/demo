package com.ryu.demo.repository;

import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ryu.demo.entity.Account;

@Transactional
@Repository
public interface AccountRepository extends JpaRepository<Account,UUID> {
    void deleteById(UUID uuid);
    List<Account> findByvalidityflagEquals(int age);
}

