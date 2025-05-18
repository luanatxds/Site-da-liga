# 🌐 Projeto Site da Liga Feminina de TI

Este repositório contém o código-fonte completo do projeto Site da Liga Feminina de TI, incluindo frontend e backend. O sistema foi desenvolvido como parte do 1° Hackaton da Liga Feminina de TI..

<img width="1556" alt="mockup" src="https://github.com/user-attachments/assets/9c77171d-e277-4851-ae2c-207a7e3f83fd" />

---

## ✅ Funcionalidades Implementadas

### Requisitos Obrigatórios

R1 – Informações Gerais sobre a Liga
O site possui uma seção institucional apresentando a Liga, incluindo missão, visão, objetivos e histórico.
O conteúdo foi escrito em linguagem acessível e apresenta identidade visual alinhada à proposta da Liga.

R2 – Painel de Membros da Liga
Existe uma página dedicada aos membros da Liga, com informações acadêmicas e profissionais.
O painel é gerenciado via área administrativa, permitindo atualizações dinâmicas conforme a equipe muda.

R3 – Cadastro de E-mail para Informações
O site inclui um campo para visitantes cadastrarem seus e-mails com validação de formato.
Ao submeter, o usuário recebe uma confirmação visual.
Os e-mails são armazenados em banco de dados e podem ser exportados pela administração.

R4 – Página do Processo Seletivo
Há uma seção explicando como funciona o processo seletivo da Liga, com requisitos, etapas e orientações claras.

R5 – Galeria de Fotos e Vídeos
O site possui uma galeria visual responsiva com imagens e vídeos de eventos, projetos e outras atividades da Liga.
Os conteúdos podem ser inseridos com título e Descrição.
O layout utiliza grid e carrossel, oferecendo uma experiência atrativa para o usuário.

### Funcionalidades Adicionais

- A Galeria mais elaborada:
  - Foi colocada como forma de portfólio de projetos, eventos, pesquisas e outros que a liga promove ou participa, permitindo a adição de várias fotos e vídeos dentro de cada item do portfólio;
  - Filtro de projetos do portfólio por tipo;
    
- Área do Administrador:
  -  Visualização e gerenciamento dos emails cadastrados na newsletter:
      -  Botão para exportar arquivo Excel;
      -  Exclusão de emails da lista;
        
  - Visualização e gerenciamento da galeria de membros e de projetos:
      - Edição, Remoção e Adição de novos itens;
        
- Interface responsiva com template BootstrapMade

---

## 💻 Tecnologias Utilizadas

### Design
- Prototipação com Figma

### Frontend
- HTML5, CSS3, JavaScript
- Bootstrap 5 (template [Active](https://bootstrapmade.com/active-free-bootstrap-template/))
- [XLSX.js](https://github.com/SheetJS/sheetjs) (para exportação de e-mails)

### Backend
- Node.js com Express.js
- Prisma ORM
- SQLite (base de dados local leve)
- Multer (para upload de imagens)
- JSON Web Token (JWT) para autenticação

---

## 📸 Capturas de Tela

<h3>Tela inicial</h3>

![gif1](https://github.com/user-attachments/assets/ce8bf4fc-8ebd-4337-9af9-5195cce1442b)


<table>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/687e6aae-88d6-4704-bba6-09e3e5880561" width="100%" />
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/0e21257e-2424-4e07-bc16-dd98c243eff2" width="100%" />
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/05fb06b8-2053-4083-a4d4-c0c6a890616b" width="100%" />
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/bd8080ac-55e0-460a-8cd9-714a4d4a9e24" width="100%" />
    </td>
  </tr>
</table>


<h3>Funcionalidade Newsletter</h3>

![gif2](https://github.com/user-attachments/assets/85f7ae5e-3e12-4fbc-b330-3eb92c2570e0)

<h3>Área do Administrador</h3>

![gif3](https://github.com/user-attachments/assets/d504a19f-4b8e-4efb-8615-f855471f71b6)

<h3>Funcionalidades da Área do Administrador</h3>

![gif4](https://github.com/user-attachments/assets/d7b179ba-b59c-4cdf-987b-4c650c32a538)



---

## 🛠️ Instruções de Execução

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- Git (opcional, apenas para clonar o repositório)

### 1. Clone o projeto (ou baixe o ZIP)

>  git clone https://github.com/luanatxds/Site-da-liga.git
>  cd Site-da-liga

### 2. Instale as dependências

>  npm install

### 3. Execute a aplicação

>  npm start

*O servidor será iniciado em http://localhost:3000*

### 4.(Opcional) Para visualizar o banco de dados via Prisma Studio:

>  npx prisma studio

<br><br>

## 📋 Processo de Criação e Desafios Enfrentados

### Planejamento e Design: 
O projeto começou com um estudo de UX para entender como era a melhor forma possível de fezer o site, apesar do curto tempo.
Foram feitas pesquisas de "mercado" para entender como outros sites semelhantes são estruturados.
Utilizei ferramentas de contrast check e conceitos de UX, como evitar uso de tema escuro e cores de baixo contraste, para melhorar a acessibilidade.
E criei wireframes e protótipos no Figma, utilizando como base um template responsivo do BootstrapMade para facilitar o desenvolvimento. 
Meu maior desafio foi o tempo, pois nem tudo que queria colocar no design era possível em tão pouco tempo.


### Organização do Backend: 
Optei por usar Prisma + SQLite para o banco de dados e Node.js + Espress por simplicidade e rapidez durante o desenvolvimento local.
Esta foi a minha primeira vez fazendo um backend. Ainda não havia feito nada parecido na faculdade, apenas pequenos sisteminhas usando lógica de programação. 
Utilizei o ThunderClient do VSCode para testar requisições.
Tive muitos bugs durante o desenvolvimento e vários desafios tendo que fazer coisas que eu não vazia ideia de como funcionavam, como ultilização de autenticação e criação de rotas.

  #### Desafios com Upload de Imagens: 
  Foi necessário adaptar o backend com Multer e ajustar a lógica de edição de imagens para evitar conflitos e manter as URLs consistentes.

  #### Autenticação: 
  JWT foi utilizado para proteger rotas administrativas. Foi um desafio integrar essa proteção ao frontend.

  #### Exportação de dados:
  A exportação de e-mails exigiu a integração da biblioteca SheetJS (XLSX.js), o que exigiu ajustes no carregamento da lib via script.

### Frontend
Para começar utilizei um template do BootstrapMade como base, para otimizar o tempo de desenvolvimento sem perder qualidade.
Optei por ultilizar Javascript puro por falta de proficiência com frameworks. 
Ultilizei bootstrap para agilizar o desenvolvimento e deixar a página responsiva mais facilmente.
Tive muita dificuldade para integrar com o backend, pois é a minha primeira vez fazendo isso.

### Conclusão
Apesar dos desafios enfrentados — especialmente por ser minha primeira experiência prática com backend e integração completa de um sistema — o projeto me proporcionou um grande aprendizado. 
Desde o planejamento de UX até a implementação do frontend e backend, cada etapa contribuiu para o desenvolvimento das minhas habilidades técnicas e de resolução de problemas. 

---
🧑‍💻 Autora: 
Luana Teixeira


