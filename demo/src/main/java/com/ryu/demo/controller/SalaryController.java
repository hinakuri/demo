package com.ryu.demo.controller;

import java.sql.Time;
import java.sql.Timestamp;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ryu.demo.config.ConditionSerch;
import com.ryu.demo.entity.Salary;
import com.ryu.demo.repository.SalaryRepository;
import com.ryu.demo.request.SalaryCreateRequest;
import com.ryu.demo.request.SalaryDeleteRequest;
import com.ryu.demo.request.SalarySerchRequest;
import com.ryu.demo.response.SalaryResponse;

import lombok.SneakyThrows;
import lombok.val;

@RestController //viewに遷移せず戻り値をレスポンスのコンテンツとする
@CrossOrigin
public class SalaryController {
	 @Autowired  //DIコンテナからインスタンスを注入するための指定
	    private SalaryRepository salaryRepository;
	 NumberFormat ni = NumberFormat.getNumberInstance();
	    @SneakyThrows //検査例外を非検査例外にすることでコードをシンプルにする
	    @GetMapping(path = "/salary/get")//与えられたURI表現式と一致するGETリクエストを処理する
	    public ResponseEntity<List<SalaryResponse>> getSalary() {
	        System.out.println("Log:test");
	        
	        val mapper = salaryRepository.findAll();
	        
	        return ResponseEntity.ok(
	                mapper.stream().map(user ->
	                        SalaryResponse.builder().
	                        month_day(new StringBuilder(user.getMonthday()).insert(4, "-").toString()).
	                        employee_name(user.getAccount().getEmployee_first_name()+ user.getAccount().getEmployee_last_name()).
	                        employee_number(user.getEmployeenumber()).
	                        unit_price(ni.format(user.getUnitprice())).
	                        work_time(user.getWorktime()).
	                        amount_money(ni.format(user.getAmountmoney())).
	                        working_days(user.getWorkingdays()).
	                        holiday(user.getHoliday()).
	                		create_day(user.getCreate_day()).
	                		create_time(user.getCreate_time()).
	                		update_day(user.getUpdate_day()).
	                		update_time(user.getUpdate_time())
	                        .build()).collect(Collectors.toList()));
	    }
	    
	    @GetMapping(path = "/salary/serch")//与えられたURI表現式と一致するGETリクエストを処理する
	    public ResponseEntity<List<SalaryResponse>> SerchSalary(SalarySerchRequest request) {
	        System.out.println("Log:test");
	        ConditionSerch serch = new ConditionSerch();
	        val mapper = salaryRepository.findAll(Specification.
	        		where(serch.monthEqual(request.getMonth()))
	        		.or(serch.monthdayEqual(request.getMonth(),request.getDay()))
	        		.and(serch.dayEqual(request.getDay()))
	        		.and(serch.EmployeeNumberEqual(request.getEmployee_number())));
	        
			return ResponseEntity.ok(
	                mapper.stream().map(user ->
	                        SalaryResponse.builder().
	                        month_day(new StringBuilder(user.getMonthday()).insert(4, "-").toString()).
	                        employee_name(user.getAccount().getEmployee_first_name()+ user.getAccount().getEmployee_last_name()).
	                        employee_number(user.getEmployeenumber()).
	                        unit_price(ni.format(user.getUnitprice())).
	                        work_time(user.getWorktime()).
	                        amount_money(ni.format(user.getAmountmoney())).
	                        working_days(user.getWorkingdays()).
	                        holiday(user.getHoliday()).
	                		create_day(user.getCreate_day()).
	                		create_time(user.getCreate_time()).
	                		update_day(user.getUpdate_day()).
	                		update_time(user.getUpdate_time())
	                        .build()).collect(Collectors.toList()));
	    }
	        
	    @PostMapping(path="/salary/create")//与えられたURI表現式と一致するPOSTの要請を処理する
	    private ResponseEntity<Void> createAccounts(@RequestBody SalaryCreateRequest request){
	        val salary = new Salary();
	        LocalDateTime nowDate = LocalDateTime.now(); 
	        DateTimeFormatter dtf1 = DateTimeFormatter.ofPattern("HH:mm:ss"); 
	        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
	        salary.setMonthday(request.getMonth()+request.getDay());
	        salary.setEmployeenumber(request.getEmployee_number());
	        salary.setUnitprice(Integer.parseInt(request.getUnit_price().replace(",","")));
	        salary.setWorktime(request.getWork_time());
	        salary.setAmountmoney((int) Math.round(request.getWork_time()*
	        		(Integer.parseInt(request.getUnit_price().replace(",","")))));
	        salary.setWorkingdays(request.getWorking_days());
	        salary.setHoliday(request.getHoliday());
	        salary.setCreate_day(timestamp);
	        salary.setCreate_time(Time.valueOf(dtf1.format(nowDate)));
	        salaryRepository.saveAndFlush(salary);
	    return ResponseEntity.noContent().build();
	    }
	    @PostMapping(path="/salary/update")//与えられたURI表現式と一致するPOSTの要請を処理する
	    private ResponseEntity<Void> updateAccounts(@RequestBody SalaryCreateRequest request){
	        val salary = new Salary();
	        LocalDateTime nowDate = LocalDateTime.now(); 
	        DateTimeFormatter dtf1 = DateTimeFormatter.ofPattern("HH:mm:ss"); 
	        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
	        Optional<Salary> sal = salaryRepository.findById(request.getEmployee_number());
	        salary.setMonthday(request.getMonth()+ request.getDay());
	        salary.setEmployeenumber(request.getEmployee_number());
	        salary.setUnitprice(Integer.parseInt(request.getUnit_price().replace(",","")));
	        salary.setWorktime(request.getWork_time());
	        salary.setAmountmoney((int) Math.round(request.getWork_time()*
	        		(Integer.parseInt(request.getUnit_price().replace(",","")))));
	        salary.setWorkingdays(request.getWorking_days());
	        salary.setHoliday(request.getHoliday());
	        salary.setCreate_day(sal.get().getCreate_day());
	        salary.setCreate_time(sal.get().getCreate_time());
	        salary.setUpdate_day(timestamp);
	        salary.setUpdate_time(Time.valueOf(dtf1.format(nowDate)));
	        salaryRepository.saveAndFlush(salary);
	    return ResponseEntity.noContent().build();  
	    }
	    @PostMapping(path="/salary/delete")
	    private ResponseEntity<Void> deleteProducts(@RequestBody SalaryDeleteRequest request){
	        salaryRepository.deleteById(request.getEmployee_number());
	        return ResponseEntity.noContent().build();
	    }
	    
}
	    
	   