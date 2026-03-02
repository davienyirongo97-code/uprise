package com.microfinance.repository;

import com.microfinance.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByNationalId(String nationalId);
    List<Client> findByBranchId(Long branchId);
}
