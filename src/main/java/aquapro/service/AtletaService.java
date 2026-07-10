package aquapro.service;

import aquapro.model.Atleta;
import aquapro.repository.AtletaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AtletaService {

    private final AtletaRepository repository;

    public AtletaService(AtletaRepository repository) {
        this.repository = repository;
    }

    public List<Atleta> listar() {
        return repository.findAll();
    }

    public Atleta buscar(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Atleta salvar(Atleta atleta) {
        return repository.save(atleta);
    }

    public Atleta atualizar(Long id, Atleta novosDados) {
        Atleta existente = repository.findById(id).orElse(null);

        if (existente == null) {
            return null;
        }

        existente.setNome(novosDados.getNome());
        existente.setIdade(novosDados.getIdade());
        existente.setCpf(novosDados.getCpf());
        existente.setMatricula(novosDados.getMatricula());
        existente.setEstilo(novosDados.getEstilo());
        existente.setMensalidade(novosDados.getMensalidade());
        existente.setTempoProva(novosDados.getTempoProva());

        return repository.save(existente);
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }
}