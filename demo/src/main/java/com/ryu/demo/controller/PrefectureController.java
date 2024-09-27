package com.ryu.demo.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ryu.demo.entity.Prefecture;
import com.ryu.demo.repository.PrefectureRepository;
import com.ryu.demo.request.PrefectureCreateRequest;
import com.ryu.demo.request.PrefectureDeleteRequest;
import com.ryu.demo.response.PrefectureResponse;

import lombok.SneakyThrows;
import lombok.val;

@RestController
@CrossOrigin
public class PrefectureController {
    @Autowired
    private PrefectureRepository prefectureRepository;

    @SneakyThrows
    @GetMapping(path = "/prefecture/get")
    public ResponseEntity<List<PrefectureResponse>> getPrefecture() {
        System.out.println("Log:test");
        val mapper = prefectureRepository.findAll();;
        return ResponseEntity.ok(
                mapper.stream().map(prefecture ->
                        PrefectureResponse.builder().
                        prefecture_code(prefecture.getPrefecture_code()).
                        prefecture_name(prefecture.getPrefecture_name()).
                                build()).collect(Collectors.toList()));
    }

    @PostMapping(path="/prefecture/create")
    private ResponseEntity<Void> createPrefecture(@RequestBody PrefectureCreateRequest request){
        val prefecture = new Prefecture();
//        prefecture.setPrefecture_code(Objects.isNull(request.getPrefecture_code()) ? null : request.getPrefecture_code());
        prefecture.setPrefecture_code(request.getPrefecture_code());
        prefecture.setPrefecture_name(request.getPrefecture_name());
        System.out.println("test:"+request.toString());
        prefectureRepository.saveAndFlush(prefecture);
    return ResponseEntity.noContent().build();
    }
    
    @PostMapping(path="/prefecture/delete")
    private ResponseEntity<Void> deletePrefecture(@RequestBody PrefectureDeleteRequest request){
        prefectureRepository.deleteById(request.getPrefecture_code());
        return ResponseEntity.noContent().build();
    }
}
