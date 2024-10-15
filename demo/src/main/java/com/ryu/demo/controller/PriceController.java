package com.ryu.demo.controller;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
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
import com.ryu.demo.request.PriceSerchRequest;
import com.ryu.demo.response.PriceResponse;
import com.ryu.demo.response.UnitPriceResponse;

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
                employee_number(user.getEmployeenumber()).
                unit_price(user.getUnit_price()).
                start_date(user.getStartdate()).
                end_date(user.getEnddate()).
                delete_flag(user.getDeleteflag()).
                create_day(user.getCreate_day()).
                create_time(user.getCreate_time()).
                update_day(user.getUpdate_day()).
                update_time(user.getUpdate_time())
                .build()).collect(Collectors.toList()));
    }
    @GetMapping(path = "/price/serch")//与えられたURI表現式と一致するGETリクエストを処理する
    public ResponseEntity<List<UnitPriceResponse>> SerchPrice(PriceSerchRequest request) {
        System.out.println("Log:test");
        System.out.println(request.getMonth()+"-"+request.getDay()+"-01");
        Date date =Date.valueOf(request.getMonth()+"-"+request.getDay()+"-01");
        val mapper = PriceRepository.findByEmployeenumberAndStartdateLessThanEqualAndEnddateGreaterThanEqual
        		(UUID.fromString(request.getEmployee_number()), date, date);
        
		return ResponseEntity.ok(
                mapper.stream().map(user ->
                UnitPriceResponse.builder().
                unit_price(user.getUnit_price())
                .build()).collect(Collectors.toList()));
    }
    @PostMapping(path = "/price/create")
    public ResponseEntity<List<PriceResponse>> CreatePrice(@RequestBody PriceCreateRequest req) {
    	val price = new PriceCreate();
    	LocalDateTime nowDate = LocalDateTime.now(); 
        DateTimeFormatter dtf1 = DateTimeFormatter.ofPattern("HH:mm:ss"); 
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        price.setEmployee_number(req.getEmployee_number());
        price.setUnit_price(req.getUnit_price());
        price.setStartdate(req.getStart_date());
        price.setEnddate(req.getEnd_date());
        price.setCreate_day(timestamp);
        price.setCreate_time(Time.valueOf(dtf1.format(nowDate)));
       PriceCreateRepository.saveAndFlush(price);
    return ResponseEntity.noContent().build();
    }
    @PostMapping(path = "/price/update")
    public ResponseEntity<List<PriceResponse>> UpdatePrice(@RequestBody PriceCreateRequest req) {
    	val price = new PriceCreate();
    	LocalDateTime nowDate = LocalDateTime.now(); 
        DateTimeFormatter dtf1 = DateTimeFormatter.ofPattern("HH:mm:ss"); 
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        Optional<Price> sal = PriceRepository.findById(req.getId());
        price.setEmployee_number(req.getEmployee_number());
        price.setUnit_price(req.getUnit_price());
        price.setStartdate(req.getStart_date());
        price.setEnddate(req.getEnd_date());
        price.setCreate_day(sal.get().getCreate_day());
        price.setCreate_time(sal.get().getCreate_time());
        price.setUpdate_day(timestamp);
        price.setUpdate_time(Time.valueOf(dtf1.format(nowDate)));
       PriceCreateRepository.saveAndFlush(price);
    return ResponseEntity.noContent().build();
    }
    @PostMapping(path = "/price/delete")
    public ResponseEntity<List<PriceResponse>> DeletePrice(@RequestBody PriceCreateRequest req) {
    	Optional<Price> act = PriceRepository.findById(req.getId());
    	val price = new Price();
    	price.setId(act.get().getId());
        price.setEmployeenumber(act.get().getEmployeenumber());
        price.setUnit_price(act.get().getUnit_price());
        price.setStartdate(act.get().getStartdate());
        price.setEnddate(act.get().getEnddate());
        price.setDeleteflag(0);
       PriceRepository.saveAndFlush(price);
    return ResponseEntity.noContent().build();
    }
    
    
}
