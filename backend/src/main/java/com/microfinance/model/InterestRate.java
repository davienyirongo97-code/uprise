package com.microfinance.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "interest_rates")
@Data
public class InterestRate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal rate;
    
    private String description;
    
    private Boolean active = true;
    
    @ManyToOne
    @JoinColumn(name = "set_by")
    private User setBy;
    
    private LocalDateTime effectiveFrom = LocalDateTime.now();
}
