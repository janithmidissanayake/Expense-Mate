package com.example.Jwt_Authentication.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "category_access")
@Entity
@Builder
public class CategoryUserAccess {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private boolean deleted = false;

    @ManyToOne
    private Category category;

    @ManyToOne
    private User user;

}
