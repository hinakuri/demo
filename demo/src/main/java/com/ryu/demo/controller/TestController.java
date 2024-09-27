package com.ryu.demo.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ryu.demo.repository.AccountRepository;
import com.ryu.demo.repository.TestRepository;
import lombok.SneakyThrows;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class TestController {
    @Autowired
    private TestRepository testRepository;
    @SneakyThrows
    @GetMapping(path="/test/get")
    public ResponseEntity<String> getTests(){
        val mapper = new ObjectMapper();
        return ResponseEntity.ok(mapper.writeValueAsString(testRepository.findAll()));
    }

}
