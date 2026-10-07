# Services web → BFF

`VITE_API_URL` aponta para a raiz do BFF (local: `http://localhost:3000`).
Os services usam `/web/*`, cookies com `withCredentials` e schemas Zod para
validar requests e responses. Tipos de resposta estão em `src/types/api.type.ts`.
Não há fallback automático para mocks quando a API falha.

| Service | Contrato |
| --- | --- |
| auth | `/web/auth/login`, `register`, `refresh`, `logout`, `forgot-password`, `verify-reset-code`, `reset-password` |
| profile | `/web/profile`, `/web/profile/password` |
| user (admin) | `/web/user`, busca por email, role, tipo de conta, senha, exclusão |
| group | `/web/core/groups`, detalhe e membros por `userId` |
| inventory | `/web/core/inventory`, estoques, lotes e movimentações |
| chat | `/web/core/chat/conversations`, histórico paginado e mensagens REST |
| discard | `/web/core/discards` |
| plan | `/web/plans`, catálogo de produtos, assinatura e cancelamento/reativação |
| transaction | `/web/transactions`, checkout, detalhe e cancelamento |

IDs de grupo/conversa/usuário/transação são UUIDs; IDs de produto/estoque/lote
são números. Listas paginadas preservam `content`, `number`, `size`,
`totalElements` e `totalPages`. Datas de nascimento usam `dd/MM/yyyy`;
validade usa `yyyy-MM-dd`. Campos opcionais da core-api podem vir como `null`.
Membros têm `isOwner` (não `role`); limites de plano têm `enterprise`;
o plano FREE tem `billingInterval: null`.

O cliente renova a sessão uma vez em respostas 401 de rotas protegidas.
Requests concorrentes compartilham o refresh. Falha de refresh limpa o estado
local. `ApiError` preserva `status`, `code` e `fields`, e apresenta
`displayMessage` quando fornecido pelo BFF. Checkout exige que o chamador
forneça uma chave de idempotência e a reutilize em tentativas da mesma operação.

## Telas deste checkout

Existem somente LoginPage, RegisterPage e ForgotPasswordPage no router.
Login/cadastro estão conectados e validam os formulários; cadastro coleta
data de nascimento real. O app restaura o perfil via cookie ao carregar e
oferece logout após login. O componente Sidebar também usa o usuário da sessão.
Os demais services estão disponíveis para conexão quando suas telas existirem.

Recuperação de senha usa código de seis dígitos por e-mail, validado no servidor,
com expiração de 10 minutos e troca de senha com revogação das sessões anteriores.
“Manter conectado” controla se o cookie de refresh persiste após fechar o
navegador. Home, estoque, compras, notificações, receitas, família, chat, perfil,
configurações, planos e telas comerciais ainda não existem no router deste
checkout. Os contratos BFF disponíveis e pendentes estão em
`frigus-bff/docs/core-api-todo.md`. `/web/domestic/*` responde 501 de propósito.

## Validação

`npm run build`, `npm run lint` e `npm test`.

O teste de integração é opt-in e aceita somente a stack descartável local:

```powershell
$env:FRIGUS_INTEGRATION_URL = 'http://localhost:3000'
npm test
Remove-Item Env:FRIGUS_INTEGRATION_URL
```

Ele cria usuários e dados sintéticos no banco local e percorre cadastro, login,
perfil, refresh, planos, checkout simulado, grupo, estoque, mensagem, descartes,
assinatura e logout. Não executar apontando o BFF para um banco compartilhado.
O teste de integração não foi executado nesta sessão porque o Docker Desktop não
estava disponível. O resolver de limites da core-api agora busca assinatura e
plano explicitamente, evitando depender do proxy destacado no usuário autenticado.

## Ambiente local usado

Web: `http://localhost:5173`; BFF: `http://localhost:3000`;
core-api: `http://localhost:8080`.

Use o `docker-compose.yml` de `frigus-core-api` para subir PostgreSQL, Redis e
core-api. A integração precisa de Docker e de um banco descartável com as
migrações atuais; H2 não suporta diretamente os enums PostgreSQL usados pelas
entidades. Configure as credenciais de e-mail da Brevo na core-api para validar
a entrega de códigos na recuperação de senha.
