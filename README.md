![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F.svg?style=for-the-badge&logo=node.js&logoColor=white) ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
# API REST

Projeto acadêmico em grupo — API REST com Node.js, Express e PostgreSQL.

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

| Dependência | Versão recomendada | Guia de instalação |
|---|---|---|
| **Git** | Qualquer versão recente | [git-scm.com/downloads](https://git-scm.com/downloads) |

> **Windows obrigatório** para uso do `run.bat`.
> 
### Dependências opcionais

Instale apenas se o servidor não estiver respondendo. Necessário para rodar o servidor localmente.

| Dependência | Versão recomendada | Guia de instalação |
|---|---|---|
| **Node.js** | v18 ou superior | [nodejs.org/en/download](https://nodejs.org/en/download) |
| **npm** | Incluído com o Node.js | [docs.npmjs.com/downloading-and-installing-node-js-and-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) |


---

## Como executar o projeto

### 1. Clonar o repositório

Abra o terminal (CMD, PowerShell ou Git Bash) e execute:

```bash
git clone https://github.com/alyffurlan/api-rest.git
```

Em seguida, entre na pasta do projeto:

```bash
cd api-rest
```

---

### 2. Configurar o arquivo `.env`

Dentro do projeto, existe a pasta `config/`. Você deve criar o arquivo `.env` dentro dela com as variáveis de ambiente preenchidas.

**Caminho do arquivo:** `config/.env`

```
# Exemplo de conteúdo do .env
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=nome_do_banco
```

> Preencha os valores de acordo com as credenciais do seu banco de dados PostgreSQL local.

---

### 3. Abrir o front-end

Abra o arquivo `index.html` localizado na pasta `view/` diretamente no navegador:

```
api-rest/
└── view/
    └── index.html   ← abra este arquivo no navegador
```

Você pode abrir dando duplo clique no arquivo ou arrastando-o para o navegador.

---

## Solução de problemas
Caso o servidor não responder às requisições HTTP, você precisará inicializar o próprio servidor. Para fazer isso, primeiro instale as dependências opcionais necessárias.
Com o arquivo `.env` configurado, dê um duplo clique no arquivo `run.bat` na raiz do projeto.

```
api-rest/
└── run.bat   ← duplo clique aqui
```

O script irá checar por dependências automaticamente (caso ainda não estejam instaladas) e iniciar o servidor Node.js. Aguarde até que a mensagem de servidor rodando apareça no terminal.
Ao abrir o arquivo `index.html`, modifique o valor do endpoint. Antes de fazer uma requisição, troque `https://api-rest-pr24.onrender.com` por `http://localhost:68` no campo escrito "ENDPOINT".

---

## Dependências do projeto

As dependências são gerenciadas pelo npm e estão declaradas no `package.json`:

| Pacote | Versão | Descrição |
|---|---|---|
| [express](https://expressjs.com/) | ^5.2.1 | Framework web para Node.js |
| [postgres](https://github.com/porsager/postgres) | ^3.4.9 | Cliente PostgreSQL para Node.js |
| [cors](https://github.com/expressjs/cors) | ^2.8.6 | Middleware para habilitar CORS |

> As dependências são instaladas automaticamente ao clonar o projeto. Para instalar manualmente, rode `npm install` no terminal dentro da pasta do projeto.

---
