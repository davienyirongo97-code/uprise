package com.microfinance.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "branches")
@Data
public class Branch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String branchCode;
    
    @Column(nullable = false)
    private String branchName;
    
    private String location;
    
    private String contactPhone;
    
    private Boolean active = true;
    
    private LocalDateTime createdAt = LocalDateTime.now();
}
