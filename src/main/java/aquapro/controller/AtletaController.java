package aquapro.controller;

import aquapro.model.Atleta;
import aquapro.service.AtletaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/atletas")
@CrossOrigin("*")
public class AtletaController {

    private final AtletaService service;

    public AtletaController(AtletaService service) {
        this.service = service;
    }

    // Consultar - listar todos
    @GetMapping
    public List<Atleta> listar() {
        return service.listar();
    }

    // Consultar - buscar um pelo id
    @GetMapping("/{id}")
    public ResponseEntity<Atleta> buscar(@PathVariable Long id) {
        Atleta atleta = service.buscar(id);
        if (atleta == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(atleta);
    }

    // Inserir
    @PostMapping
    public Atleta salvar(@RequestBody Atleta atleta) {
        return service.salvar(atleta);
    }

    // Atualizar
    @PutMapping("/{id}")
    public ResponseEntity<Atleta> atualizar(@PathVariable Long id, @RequestBody Atleta atleta) {
        Atleta atualizado = service.atualizar(id, atleta);
        if (atualizado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(atualizado);
    }

    // Excluir
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}