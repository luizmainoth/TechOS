package aquapro.model;

import jakarta.persistence.*;

@Entity
@Table(name = "atletas")
public class Atleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private Integer idade;
    private String cpf;
    private String matricula;
    private String estilo;
    private Double mensalidade;
    private Double tempoProva;

    public Atleta() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Integer getIdade() {
        return idade;
    }

    public void setIdade(Integer idade) {
        this.idade = idade;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public String getEstilo() {
        return estilo;
    }

    public void setEstilo(String estilo) {
        this.estilo = estilo;
    }

    public Double getMensalidade() {
        return mensalidade;
    }

    public void setMensalidade(Double mensalidade) {
        this.mensalidade = mensalidade;
    }

    public Double getTempoProva() {
        return tempoProva;
    }

    public void setTempoProva(Double tempoProva) {
        this.tempoProva = tempoProva;
    }
}