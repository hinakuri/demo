package com.ryu.demo.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ryu.demo.entity.Price;
import com.ryu.demo.entity.PriceCreate;
import com.ryu.demo.repository.PriceCreateRepository;
import com.ryu.demo.repository.PriceRepository;
import com.ryu.demo.request.PriceCreateRequest;
import com.ryu.demo.response.PriceResponse;

import lombok.SneakyThrows;
import lombok.val;
@RestController //viewに遷移せず戻り値をレスポンスのコンテンツとする
@CrossOrigin
public class PriceController {
	@Autowired
    private PriceRepository PriceRepository;
	@Autowired
	private PriceCreateRepository PriceCreateRepository;

    @SneakyThrows
    @GetMapping(path = "/price/get")
    public ResponseEntity<List<PriceResponse>> getPrefecture() {
        System.out.println("Log:test");
        val mapper = PriceRepository.findBydeleteflagEquals(1);
        return ResponseEntity.ok(
                mapper.stream().map(user ->
                PriceResponse.builder().
                id(user.getId()).
                employee_number(user.getEmployee_number()).
                unit_price(user.getUnit_price()).
                start_date(user.getStartdate()).
                end_date(user.getEnddate()).
                delete_flag(user.getDeleteflag())
                .build()).collect(Collectors.toList()));
    }
    @PostMapping(path = "/price/create")
    public ResponseEntity<List<PriceResponse>> CreatePrice(@RequestBody PriceCreateRequest req) {
    	val price = new PriceCreate();
        price.setEmployee_number(req.getEmployee_number());
        price.setUnit_price(req.getUnit_price());
        price.setStartdate(req.getStart_date());
        price.setEnddate(req.getEnd_date());
       PriceCreateRepository.saveAndFlush(price);
    return ResponseEntity.noContent().build();
    }
    @PostMapping(path = "/price/update")
    public ResponseEntity<List<PriceResponse>> UpdatePrice(@RequestBody PriceCreateRequest req) {
    	val price = new PriceCreate();
        price.setEmployee_number(req.getEmployee_number());
        price.setUnit_price(req.getUnit_price());
        price.setStartdate(req.getStart_date());
        price.setEnddate(req.getEnd_date());
       PriceCreateRepository.saveAndFlush(price);
    return ResponseEntity.noContent().build();
    }
    @PostMapping(path = "/price/delete")
    public ResponseEntity<List<PriceResponse>> DeletePrice(@RequestBody PriceCreateRequest req) {
    	Optional<Price> act = PriceRepository.findById(req.getId());
    	val price = new Price();
    	price.setId(act.get().getId());
        price.setEmployee_number(act.get().getEmployee_number());
        price.setUnit_price(act.get().getUnit_price());
        price.setStartdate(act.get().getStartdate());
        price.setEnddate(act.get().getEnddate());
        price.setDeleteflag(0);
       PriceRepository.saveAndFlush(price);
    return ResponseEntity.noContent().build();
    }
    
    
}
