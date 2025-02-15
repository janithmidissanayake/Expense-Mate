package com.example.Jwt_Authentication.repository;

import com.example.Jwt_Authentication.model.Category;
import com.example.Jwt_Authentication.model.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUserId(Long userId);
    Optional<Category> findById(Long id);
    Optional<Category> findByName(String name);


    Optional<Category> findByNameAndUser_Id(String name, Long userId);

    List<Category> findByUserIdAndType(Long userId, CategoryType type);
    boolean existsByName(String name);

    boolean existsByNameAndUser_Id(String name, Long userId);

}
