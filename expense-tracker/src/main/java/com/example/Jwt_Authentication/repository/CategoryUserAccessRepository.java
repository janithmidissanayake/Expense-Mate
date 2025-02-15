package com.example.Jwt_Authentication.repository;

import com.example.Jwt_Authentication.model.Category;
import com.example.Jwt_Authentication.model.CategoryUserAccess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoryUserAccessRepository extends JpaRepository<CategoryUserAccess, Long> {

    // Find CategoryUserAccess records by CategoryId
    List<CategoryUserAccess> findByCategoryId(Long categoryId);
    List<CategoryUserAccess> findByUser_Id(Long userId);

}
