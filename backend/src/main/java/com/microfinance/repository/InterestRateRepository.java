package com.microfinance.repository;

import com.microfinance.model.InterestRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface InterestRateRepository extends JpaRepository<InterestRate, Long> {
    Optional<InterestRate> findFirstByActiveTrueOrderByEffectiveFromDesc();
}
