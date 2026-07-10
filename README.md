# 💻 TECH_OS // HARDWARE_MANAGER

> O **TechOS** é um sistema de gerenciamento de ordens de serviço (O.S.) desenvolvido para otimizar o fluxo de montagem, manutenção e reparo de computadores em assistências técnicas. 

Este projeto conta com uma interface Cyberpunk intuitiva baseada em terminal (Dark Mode nativo), validações de dados em tempo real no front-end e um back-end robusto conteinerizado.

---

## ⚡ Funcionalidades (Features)

- **Dashboboard Cyberpunk:** Interface visual inspirada em painéis técnicos/hacker com tabela de dados expansiva.
- **Gerenciamento de O.S.:** Cadastro, edição, leitura e exclusão (CRUD) de ordens de serviço em tempo real.
- **Filtro Avançado:** Barra de pesquisa instantânea que filtra registros por nome do cliente, CPF, código da O.S. ou tipo de serviço.
- **Validações Nativas:**
  - Máscara automática de CPF (bloqueio de letras).
  - Bloqueio de números no nome do cliente.
  - Bloqueio de datas futuras (não é possível dar entrada no futuro).
  - Cálculo automático de "Dias na Oficina" baseado na data de entrada.
- **Tradução de API (Reskin):** O front-end atua como um tradutor dinâmico, mascarando variáveis para manter o back-end intacto.

---

## 🛠️ Tecnologias Utilizadas

### Front-end
- HTML5 (Estrutura Semântica)
- CSS3 (Variáveis CSS, Flexbox, Grid, Animações Neon)
- JavaScript Vanilla (Fetch API, Manipulação de DOM, Regex para validação)

### Back-end & Banco de Dados
- **Java 17+** com **Spring Boot** (REST API)
- **PostgreSQL 16** (Banco de dados relacional)

### DevOps & Infraestrutura
- **Docker** & **Docker Compose** (Orquestração de contêineres e isolamento de ambiente)

---

## 🚀 Como executar o projeto na sua máquina

Certifique-se de ter o [Docker](https://www.docker.com/) e o [Docker Compose](https://docs.docker.com/compose/) instalados na sua máquina.

**1. Clone o repositório:**
```bash
git clone [https://github.com/SEU_USUARIO/TechOS-System.git](https://github.com/SEU_USUARIO/TechOS-System.git)
cd TechOS-System
