package jpa.repository;

import jpa.domain.Predmeti;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Predmeti entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PredmetiRepository extends JpaRepository<Predmeti, Long> {}
