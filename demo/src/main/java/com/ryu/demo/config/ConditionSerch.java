package com.ryu.demo.config;

import java.util.Calendar;
import java.util.UUID;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import com.ryu.demo.entity.Salary;


public class ConditionSerch {
	
	@SuppressWarnings("deprecation")
	public Specification<Salary> dayEqual(String month) {
	    return StringUtils.isEmpty(month) ? null : new Specification<Salary>() {
	        @Override
	        public Predicate toPredicate(Root<Salary> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
	        	int month1 = Integer.parseInt(month);
                return criteriaBuilder.equal(criteriaBuilder.function("MONTH", Integer.class, 
                        root.get("monthday")),
                		month1
                		);
            }
	    };
	}
	@SuppressWarnings("deprecation")
	public Specification<Salary> monthEqual(String month) {
	    return StringUtils.isEmpty(month) ? null : new Specification<Salary>() {
	        @Override
	        public Predicate toPredicate(Root<Salary> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                // 年の最初と最後の日を取得
                Calendar start = Calendar.getInstance();
                int month1 = Integer.parseInt(month);
                start.set(month1, Calendar.JANUARY, 1, 0, 0, 0);
                start.set(Calendar.MILLISECOND, 0);
                
                Calendar end = Calendar.getInstance();
                end.set(month1, Calendar.DECEMBER, 31, 23, 59, 59);
                end.set(Calendar.MILLISECOND, 999);
                
                return criteriaBuilder.between(root.get("monthday"), start.getTime(), end.getTime());
            }
	    };
	}
	@SuppressWarnings("deprecation")
	public Specification<Salary> EmployeeNumberEqual(String employee_number) {
	    return StringUtils.isEmpty(employee_number) ? null : new Specification<Salary>() {
	        @Override
	        public Predicate toPredicate(Root<Salary> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
	            return criteriaBuilder.equal(root.get("employeenumber"), UUID.fromString(employee_number));
	        }
	    };
	}

}
