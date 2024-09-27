package com.ryu.demo.repository;

import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ryu.demo.entity.Account;


@Transactional
@Repository
public interface JoinAccountRepository extends JpaRepository<Account,UUID> {
    void deleteById(UUID uuid);
}
