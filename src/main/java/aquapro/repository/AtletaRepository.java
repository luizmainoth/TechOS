package aquapro.repository;

import aquapro.model.Atleta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AtletaRepository extends JpaRepository<Atleta, Long> {
}