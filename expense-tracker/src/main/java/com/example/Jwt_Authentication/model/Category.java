package com.example.Jwt_Authentication.model;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "category_tb")
@Builder
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategoryType type;
    @Column(nullable = false)
    private boolean deleted = false;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Income> incomes;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Expense> expenses;

    @OneToMany(mappedBy = "category")
    private Set<CategoryUserAccess> categoryUserAccess;

}
