package com.microfinance.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "clients")
@Data
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String fullName;
    
    @Column(nullable = false, unique = true)
    private String nationalId;
    
    private LocalDate dateOfBirth;
    
    @Column(nullable = false)
    private String phoneNumber;
    
    private String email;
    
    private String address;
    
    private String nationalIdImagePath;
    
    @ManyToOne
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;
    
    @ManyToOne
    @JoinColumn(name = "registered_by")
    private User registeredBy;
    
    private LocalDateTime createdAt = LocalDateTime.now();
}
