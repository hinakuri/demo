package com.ryu.demo.controller;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ryu.demo.entity.Product;
import com.ryu.demo.repository.ProductRepository;
import com.ryu.demo.request.ProductCreateRequest;
import com.ryu.demo.request.ProductDeleteRequest;
import com.ryu.demo.response.ProductResponse;

import lombok.SneakyThrows;
import lombok.val;

@RestController
@CrossOrigin
public class ProductController {
    @Autowired
    private ProductRepository productRepository;

    @SneakyThrows
    @GetMapping(path = "/product/get")
    public ResponseEntity<List<ProductResponse>> getProducts() {
        System.out.println("Log:test");
        val mapper = productRepository.findAll();
        return ResponseEntity.ok(
                mapper.stream().map(product ->
                        ProductResponse.builder().
                                id(product.getId()).
                                itemName(product.getItemname()).
                                category(product.getCategory()).build()).collect(Collectors.toList()));
    }

    @PostMapping(path="/product/create")
    private ResponseEntity<Void> createProducts(@RequestBody ProductCreateRequest request){
        val product = new Product();
        product.setId(Objects.isNull(request.getId()) ? null : request.getId());
        product.setItemname(request.getItemName());
        product.setCategory(request.getCategory());
        System.out.println(request.toString());
        System.out.println(product.toString());
        productRepository.saveAndFlush(product);
    return ResponseEntity.noContent().build();
    }
    @PostMapping(path="/product/delete")
    private ResponseEntity<Void> deleteProducts(@RequestBody ProductDeleteRequest request){
        productRepository.deleteById(request.getId());
        return ResponseEntity.noContent().build();
    }
}