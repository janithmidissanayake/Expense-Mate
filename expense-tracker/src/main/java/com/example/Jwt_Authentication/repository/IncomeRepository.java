package com.example.Jwt_Authentication.repository;

import com.example.Jwt_Authentication.model.CategoryType;
import com.example.Jwt_Authentication.model.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByUser_Id(Long id);
    List<Income>findByUser_IdAndCategory_Type(Long id, CategoryType type);


    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Income i WHERE i.user.id = :userId")
    Integer findTotalIncomeByUserId(@Param("userId") Long userId);

//    @Query("SELECT FUNCTION('YEAR', i.incomeDate) AS year, FUNCTION('MONTH', i.incomeDate) AS month, SUM(i.amount) AS totalIncome " +
//            "FROM Income i WHERE i.user.id = :userId GROUP BY year, month ORDER BY year, month")
//    List<Object[]> findMonthlyIncomeByUserId(@Param("userId") Long userId);

    @Query("SELECT FUNCTION('YEAR', i.incomeDate) AS year, FUNCTION('MONTH', i.incomeDate) AS month, SUM(i.amount) AS totalIncome " +
            "FROM Income i WHERE i.user.id = :userId " +
            "GROUP BY FUNCTION('YEAR', i.incomeDate), FUNCTION('MONTH', i.incomeDate) " +
            "ORDER BY FUNCTION('YEAR', i.incomeDate), FUNCTION('MONTH', i.incomeDate)")
    List<Object[]> findMonthlyIncomeByUserId(@Param("userId") Long userId);

    @Query("SELECT i FROM Income i WHERE i.deleted = false")
    List<Income> findAllActiveIncomes();
    @Query("SELECT i FROM Income i WHERE i.user.id = :userId AND i.category.type = :type AND i.deleted = false")
    List<Income> findByUser_IdAndCategory_TypeAndNotDeleted(@Param("userId") Long userId, @Param("type") CategoryType type);




}
