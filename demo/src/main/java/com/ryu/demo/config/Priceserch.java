package com.ryu.demo.config;

import java.util.UUID;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import com.ryu.demo.entity.Price;

public class Priceserch {
	@SuppressWarnings("deprecation")
	@Autowired
	public Specification<Price> monthdayEqual(String month,String day) {
	    return StringUtils.isEmpty(month) ? null : new Specification<Price>() {
	        @Override
	        public Predicate toPredicate(Root<Price> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
	            return criteriaBuilder.equal(root.get("monthday"),month+day);
	        }
	    };
	}
	@SuppressWarnings("deprecation")
	public Specification<Price> dayEqual(String day) {
	    return StringUtils.isEmpty(day) ? null : new Specification<Price>() {
	        @Override
	        public Predicate toPredicate(Root<Price> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
	            return criteriaBuilder.like(root.get("monthday"), "%" +day);
	        }
	    };
	}
	@SuppressWarnings("deprecation")
	public Specification<Price> monthEqual(String month) {
	    return StringUtils.isEmpty(month) ? null : new Specification<Price>() {
	        @Override
	        public Predicate toPredicate(Root<Price> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
	            return criteriaBuilder.like(root.get("monthday"),month + "%");
	        }
	    };
	}
	@SuppressWarnings("deprecation")
	public Specification<Price> EmployeeNumberEqual(String employee_number) {
	    return StringUtils.isEmpty(employee_number) ? null : new Specification<Price>() {
	        @Override
	        public Predicate toPredicate(Root<Price> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
	            return criteriaBuilder.equal(root.get("employeenumber"), UUID.fromString(employee_number));
	        }
	    };
	}
}
