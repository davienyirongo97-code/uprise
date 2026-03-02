package com.microfinance.repository;

import com.microfinance.model.Loan;
import com.microfinance.model.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByBranchId(Long branchId);
    List<Loan> findByStatus(LoanStatus status);
    List<Loan> findByClientId(Long clientId);
}
