package com.ryu.demo.controller;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
import java.text.NumberFormat;
import java.text.ParseException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
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
import com.ryu.demo.entity.JsonExact;
import com.ryu.demo.entity.Salary;
import com.ryu.demo.repository.SalaryRepository;
import com.ryu.demo.request.SalaryCreateRequest;
import com.ryu.demo.request.SalaryDeleteRequest;
import com.ryu.demo.request.SalaryFile;
import com.ryu.demo.request.SalarySerchRequest;
import com.ryu.demo.response.SalaryResponse;

import lombok.SneakyThrows;
import lombok.val;
import lombok.var;

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
	                        month_day(user.getMonthday()).
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
	        		.and(serch.dayEqual(request.getDay()))
	        		.and(serch.EmployeeNumberEqual(request.getEmployee_number())));
	        
			return ResponseEntity.ok(
	                mapper.stream().map(user ->
	                        SalaryResponse.builder().
	                        month_day(user.getMonthday()).
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
	    private ResponseEntity<Void> createAccounts(@RequestBody SalaryCreateRequest request) throws ParseException{
	        val salary = new Salary();
	        LocalDateTime nowDate = LocalDateTime.now(); 
	        DateTimeFormatter dtf1 = DateTimeFormatter.ofPattern("HH:mm:ss"); 
	        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
	        salary.setMonthday(Date.valueOf(request.getMonth()+"-" +request.getDay()+"-01"));
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
	        salary.setMonthday(Date.valueOf(request.getMonth()+"-" +request.getDay()+"-01"));
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
	    @PostMapping("/salary/exact")
	    public void createRecords(@RequestBody List<JsonExact> records) {
	    	LocalDateTime nowDate = LocalDateTime.now();
	    	DateTimeFormatter dtf1 = DateTimeFormatter.ofPattern("yyyyMMddHHmmss"); 
	    	String time = (dtf1.format(nowDate)).toString();
	    	String file = "\\Users\\h_kur\\Downloads\\salarys_" + time + ".csv";
	    	try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))){ 
	    		writer.write("\"年月\",\"名前\",\"社員番号\",\"時給\",\"時間\",\"金額\",\"稼働日数\",\"休暇\",\"作成日\""
	    				+ ",\"作成時間\",\"更新日\",\"更新時間\"");
	    		writer.newLine();
	    		for(var record : records) {
	    			String unitPrice;
	    			String AmountMoney ;
	    			
	    			if (record.getUnitPrice().contains(",")) {
	    				unitPrice = record.getUnitPrice().replace(",","");
	    			}else {
	    				unitPrice = record.getUnitPrice();
	    			}
	    			if (record.getAmountMoney().contains(",")) {	
	    				AmountMoney = record.getAmountMoney().replace(",","");
	    			}else {
	    				AmountMoney = record.getAmountMoney();
	    			}
	    			if (record.getUpdateDay()== null) {
	    				record.setUpdateDay("");
	    				record.setUpdateTime("");
	    			}
	    			writer.write(String.join(",",
	    					"\"" + record.getMonthDay() + "\"",
	    					"\"" + record.getEmployeeName() + "\"",
	    					"\"" + record.getEmployeeNumber() + "\"",
	    					unitPrice,
	    					String.valueOf(record.getWorkTime()),
	    					AmountMoney,
	    					String.valueOf(record.getWorkingDays()),
	    					String.valueOf(record.getHoliday()),
	    					record.getCreateDay(),
	    					record.getCreateTime(),
	    					record.getUpdateDay(),
	    					record.getUpdateTime()
	    					));
	    			writer.newLine();
	    		}
	    	} catch (IOException e) {			
	    		e.printStackTrace();
	    	}  
	    	System.out.println("ok");
	    } 
	    @PostMapping("/salary/read")
	    public ResponseEntity<Void> readRecords(@RequestBody SalaryFile params) throws IOException {
	    	String filepuss = params.getFilepuss();
	    	System.out.println(filepuss);
	    	try {
	    		LocalDateTime nowDate = LocalDateTime.now(); 
	 	        DateTimeFormatter dtf1 = DateTimeFormatter.ofPattern("HH:mm:ss");
	 	        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
	    		File file = new File("\\Users\\h_kur\\Downloads\\" + filepuss);
				FileInputStream input = new FileInputStream(file);
				InputStreamReader stream = new InputStreamReader(input,"UTF-8");
				BufferedReader buffer = new BufferedReader(stream);
				
				String line ;
				 boolean isFirstLine = true;
				 
				while ((line = buffer.readLine()) != null) {
					 if (isFirstLine) {
			                isFirstLine = false;
			                continue; 
			            }
					line = line.replaceAll("\"","");
					String[] columns = line.split(",",-1);
					Salary salary = new Salary();
					for (int j = 0; j < columns.length; j++) {
						salary.setMonthday(Date.valueOf(columns[0] + "-01"));
						salary.setEmployeenumber(UUID.fromString(columns[2]));
						salary.setUnitprice(Integer.parseInt(columns[3]));
						salary.setWorktime(Double.parseDouble(columns[4]));
						salary.setAmountmoney(Integer.parseInt(columns[5]));
						salary.setWorkingdays(Integer.parseInt(columns[6]));
						salary.setHoliday(Integer.parseInt(columns[7]));
						salary.setUpdate_day(columns[10].equals("") ? columns[8].equals("")? 
								null:timestamp: Timestamp.valueOf(columns[10] + " 00:00:00"));
						salary.setUpdate_time(columns[11].equals("") ?columns[9].equals("")?
								null:Time.valueOf(dtf1.format(nowDate)):Time.valueOf(columns[11]));
						salary.setCreate_day(columns[8].equals("")? timestamp :
								Timestamp.valueOf(columns[8] + " 00:00:00"));
						salary.setCreate_time(columns[9].equals("")? Time.valueOf(dtf1.format(nowDate)):
								Time.valueOf(columns[9]));
					}
					salaryRepository.saveAndFlush(salary);
				}
											
				input.close();
				stream.close();
				buffer.close();
					
					
	    	} catch (FileNotFoundException | UnsupportedEncodingException e) {
	    		
	    		e.printStackTrace();
			}
	    	
	    	
	    	return ResponseEntity.noContent().build();
	    }   
}	
	    
	   