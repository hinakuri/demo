package com.ryu.demo.controller;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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

import com.ryu.demo.entity.Account;
import com.ryu.demo.repository.AccountRepository;
import com.ryu.demo.request.AccountCreateRequest;
import com.ryu.demo.request.AccountDeleteRequest;
import com.ryu.demo.response.AccountIdResponse;
import com.ryu.demo.response.AccountResponse;

import lombok.SneakyThrows;
import lombok.val;

@RestController //viewに遷移せず戻り値をレスポンスのコンテンツとする
@CrossOrigin
public class AccountController {
    @Autowired  //DIコンテナからインスタンスを注入するための指定
    private AccountRepository accountRepository;
    @SneakyThrows //検査例外を非検査例外にすることでコードをシンプルにする
    @GetMapping(path = "/account/get1")//与えられたURI表現式と一致するGETリクエストを処理する
    public ResponseEntity<List<AccountResponse>> getAccounts() {
        System.out.println("Log:test");
        val mapper = accountRepository.findByvalidityflagEquals(1);
        return ResponseEntity.ok(
                mapper.stream().map(user ->
                AccountResponse.builder().
                employee_number(user.getEmployee_number().toString()).
                employee_first_name(user.getEmployee_first_name()).
                employee_last_name(user.getEmployee_last_name()).
                employment_start_date(String.valueOf(user.getEmployment_start_date())).
                prefecture_name(user.getPrefecture().getPrefecture_name()).
                create_day(user.getCreate_day()).
                create_time(user.getCreate_time()).
                update(user.getUpdate()).
                update_time(user.getUpdate_time()).
                validity_flag(user.getValidityflag())
                .build()).collect(Collectors.toList()));
    }
    @GetMapping(path = "/account/get")//与えられたURI表現式と一致するGETリクエストを処理する
    public ResponseEntity<List<AccountResponse>> getAccounts1() {
        System.out.println("Log:test");
        val mapper = accountRepository.findByvalidityflagEquals(1);
        return ResponseEntity.ok(
                mapper.stream().map(user ->
                AccountResponse.builder().
                employee_number(user.getEmployee_number().toString())
                .build()).collect(Collectors.toList()));
    }
    @GetMapping(path = "/account")//与えられたURI表現式と一致するGETリクエストを処理する
    public ResponseEntity<List<AccountIdResponse>> getId() {
        System.out.println("Log:test");
        val mapper = accountRepository.findByvalidityflagEquals(1);
        return ResponseEntity.ok(
                mapper.stream().map(user ->
                AccountIdResponse.builder().
                employee_number(user.getEmployee_number().toString())
                .build()).collect(Collectors.toList()));
    }
    @PostMapping(path="/account/create")//与えられたURI表現式と一致するPOSTの要請を処理する
    private ResponseEntity<Void> createAccounts(@RequestBody AccountCreateRequest request){
        val account = new Account();
        LocalDateTime nowDate = LocalDateTime.now();
        DateTimeFormatter dtf1 = DateTimeFormatter.ofPattern("yyyy-MM-dd"); 
        DateTimeFormatter dtf2 = DateTimeFormatter.ofPattern("HH:mm:ss"); 
        account.setEmployee_number(request.getEmployee_number());
        account.setEmployee_first_name(request.getEmployee_first_name());
        account.setEmployee_last_name(request.getEmployee_last_name());
        account.setEmployment_start_date((request.getEmployment_start_date()));
        account.setPrefecture_code(request.getPrefecture_code());
        account.setCreate_day(Date.valueOf(dtf1.format(nowDate)));
        account.setCreate_time(Time.valueOf(dtf2.format(nowDate)));
      	account.setValidityflag(1);
        accountRepository.saveAndFlush(account);
    return ResponseEntity.noContent().build();
    }
    @PostMapping(path="/account/update")//与えられたURI表現式と一致するPOSTの要請を処理する
    private ResponseEntity<Void> updateAccounts(@RequestBody AccountCreateRequest request){
        val account = new Account();
        LocalDateTime nowDate = LocalDateTime.now();
        DateTimeFormatter dtf1 = DateTimeFormatter.ofPattern("yyyy-MM-dd"); 
        DateTimeFormatter dtf2 = DateTimeFormatter.ofPattern("HH:mm:ss"); 
        Optional<Account> act = accountRepository.findById(request.getEmployee_number());  	
    	act.get().getEmployee_first_name();	
        account.setEmployee_number(request.getEmployee_number());
        account.setEmployee_first_name(request.getEmployee_first_name());
        account.setEmployee_last_name(request.getEmployee_last_name());
        account.setEmployment_start_date((request.getEmployment_start_date()));
        account.setPrefecture_code(request.getPrefecture_code());
        account.setCreate_day(act.get().getCreate_day());
        account.setCreate_time(act.get().getCreate_time());
        account.setUpdate(Date.valueOf(dtf1.format(nowDate)));
        account.setUpdate_time(Time.valueOf(dtf2.format(nowDate)));
        account.setValidityflag(1);
        accountRepository.saveAndFlush(account);
    return ResponseEntity.noContent().build();
    }
    
    @PostMapping(path="/account/delete")
    private ResponseEntity<Void> deleteAccounts(@RequestBody AccountDeleteRequest request){
    	 Optional<Account> act = accountRepository.findById(request.getEmployee_number());
    	 val account = new Account();
    	 LocalDateTime nowDate = LocalDateTime.now();
    	 DateTimeFormatter dtf1 = DateTimeFormatter.ofPattern("yyyy-MM-dd"); 
    	 DateTimeFormatter dtf2 = DateTimeFormatter.ofPattern("HH:mm:ss"); 
    	 act.get().getEmployee_first_name();	
         account.setEmployee_number(act.get().getEmployee_number());
         account.setEmployee_first_name(act.get().getEmployee_first_name());
         account.setEmployee_last_name(act.get().getEmployee_last_name());
         account.setEmployment_start_date((act.get().getEmployment_start_date()));
         account.setPrefecture_code(act.get().getPrefecture_code());
         account.setCreate_day(act.get().getCreate_day());
         account.setCreate_time(act.get().getCreate_time());
         account.setUpdate(Date.valueOf(dtf1.format(nowDate)));
         account.setUpdate_time(Time.valueOf(dtf2.format(nowDate)));
         account.setValidityflag(0);
    	 accountRepository.saveAndFlush(account);
    return ResponseEntity.noContent().build();
    }
}