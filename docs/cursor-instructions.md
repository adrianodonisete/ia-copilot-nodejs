---
name: Cursor instructions files
overview: Criar a pasta `.cursor/rules/` e adicionar arquivos `.mdc` de instruções para o Cursor, alinhados ao stack (Node.js, Express, ESM, better-sqlite3) e às convenções já usadas no projeto.
todos: []
isProject: false
---

# Plano: Instruções (rules) para o Cursor

## Contexto do projeto

- **Stack**: Node.js com `"type": "module"` (ESM), Express, better-sqlite3, bcryptjs, jsonwebtoken, multer, cors.
- **Estrutura**: [app.js](app.js) monta rotas em `/users` e `/events`; cada recurso tem `routes/*.js`, `controllers/*.js` e `models/*.js`; utilitários em [util/](util/) (auth, upload); banco em [database.js](database.js).
- **Convenção existente**: [.github/copilot-instructions.md](.github/copilot-instructions.md) só define “Use ESM imports / exports”. As rules vão formalizar o resto das convenções.

## O que será criado

Serão criados **quatro arquivos** em `.cursor/rules/`, no formato `.mdc` com frontmatter YAML (conforme a skill de create-rule).

---

### 1. `core-standards.mdc` (sempre ativo)

- **Frontmatter**: `alwaysApply: true`, `description` sobre padrões gerais do projeto.
- **Conteúdo**:
  - Usar **apenas ESM**: `import`/`export`, extensão `.js` em imports relativos (ex.: `from '../models/event.js'`).
  - Estrutura de pastas: `routes/`, `controllers/`, `models/`, `util/`, raiz com `app.js` e `database.js`.
  - Não usar `require()` nem `module.exports`.
- Regra curta, com exemplos de import/export corretos.

---

### 2. `express-routes-controllers.mdc` (camada API)

- **Frontmatter**: `globs: **/routes/*.js,**/controllers/*.js,app.js`, `alwaysApply: false`.
- **Conteúdo**:
  - **Rotas**: `express.Router()`, importar handlers dos controllers e middlewares (ex.: `authenticate`, `upload.single('image')`), `export default router`.
  - **Controllers**: exportar funções nomeadas assíncronas (ex.: `create`, `edit`, `destroy`, `all`, `one`); usar `async (req, res)`; responder com `res.status(...).json(...)`.
  - **Códigos HTTP**: 200/201 sucesso, 400 validação, 401 não autorizado, 404 não encontrado, 500 erro interno.
  - **Erros**: em try/catch, retornar `{ message: string }` em JSON; validação no controller (ex.: `validateRequest(req)` que lança `Error` com mensagem).
- Referência opcional aos arquivos [routes/events.js](routes/events.js) e [controllers/events-controller.js](controllers/events-controller.js) como exemplos.

---

### 3. `models-database.mdc` (modelos e banco)

- **Frontmatter**: `globs: **/models/*.js,database.js`, `alwaysApply: false`.
- **Conteúdo**:
  - **database.js**: `initializeDatabase()` cria tabelas com `better-sqlite3`; `getDatabase()` retorna a instância e lança se não inicializada.
  - **Models**: usar `getDatabase()` de [database.js](database.js); prepared statements (`db.prepare(...).run()` / `.get()` / `.all()`); parâmetros com `?` para evitar SQL injection.
  - Aceitar tanto **classe default export** com métodos estáticos (ex.: [models/event.js](models/event.js)) quanto **funções nomeadas export** (ex.: [models/user.js](models/user.js)); manter consistência por recurso.
  - Senhas: hash com bcrypt antes de persistir (ex.: em `createUser`).
- Exemplo curto de `db.prepare` + `stmt.run(id)`.

---

### 4. `util-auth-upload.mdc` (util)

- **Frontmatter**: `globs: **/util/*.js`, `alwaysApply: false`.
- **Conteúdo**:
  - **auth.js**: JWT com `jsonwebtoken`; `generateToken(user)`, `verifyToken(token)`, middleware `authenticate(req, res, next)` que lê `Authorization: Bearer <token>`, define `req.user` e responde 401 em falha.
  - **upload.js**: multer para upload de arquivos; uso em rotas como `upload.single('image')`.
  - Manter helpers em `util/` reutilizáveis e sem lógica de negócio das rotas.
- Referência a [util/auth.js](util/auth.js) como exemplo de middleware.

---

## Estrutura final

```
.cursor/
  rules/
    core-standards.mdc
    express-routes-controllers.mdc
    models-database.mdc
    util-auth-upload.mdc
```

## Boas práticas (skill)

- Cada rule com **menos de 50 linhas** e **um foco**.
- Frontmatter com `description` e `globs` ou `alwaysApply` corretos.
- Incluir exemplos concretos (trechos de código) onde fizer sentido.
- Não criar documentação extra (ex.: README em .cursor) a menos que você peça.

## Observação

O arquivo [.github/copilot-instructions.md](.github/copilot-instructions.md) pode continuar existindo para o GitHub Copilot; as rules em `.cursor/rules/` são específicas do Cursor e mais detalhadas para este repositório.
