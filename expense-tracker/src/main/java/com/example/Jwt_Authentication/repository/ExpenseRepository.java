package com.example.Jwt_Authentication.repository;

import com.example.Jwt_Authentication.model.CategoryType;
import com.example.Jwt_Authentication.model.Expense;
import com.example.Jwt_Authentication.model.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUser_Id(Long id);
    List<Expense>findByUser_IdAndCategory_Type(Long id, CategoryType type);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.user.id = :userId")
    Integer findTotalExpenseByUserId(@Param("userId") Long userId);

    @Query("SELECT FUNCTION('YEAR', i.expenseDate) AS year, FUNCTION('MONTH', i.expenseDate) AS month, SUM(i.amount) AS totalExpense " +
            "FROM Expense i WHERE i.user.id = :userId " +
            "GROUP BY FUNCTION('YEAR', i.expenseDate), FUNCTION('MONTH', i.expenseDate) " +
            "ORDER BY FUNCTION('YEAR', i.expenseDate), FUNCTION('MONTH', i.expenseDate)")
    List<Object[]> findMonthlyExpenseByUserId(@Param("userId") Long userId);

    @Query("SELECT i FROM Expense i WHERE i.deleted = false")
    List<Expense> findAllActiveExpenses();
    @Query("SELECT i FROM Expense i WHERE i.user.id = :userId AND i.category.type = :type AND i.deleted = false")
    List<Expense> findByUser_IdAndCategory_TypeAndNotDeleted(@Param("userId") Long userId, @Param("type") CategoryType type);



}
