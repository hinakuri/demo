package com.ryu.demo.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ryu.demo.entity.PriceCreate;

public interface PriceCreateRepository extends JpaRepository<PriceCreate,UUID> {
}

