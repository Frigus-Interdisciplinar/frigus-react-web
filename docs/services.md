# Services web → BFF

`VITE_API_URL` aponta para a raiz do BFF (local: `http://localhost:3000`).
Os services usam `/web/*`, cookies com `withCredentials` e schemas Zod para
validar requests e responses. Tipos de resposta estão em `src/types/api.type.ts`.
Não há fallback automático para mocks quando a API falha.

| Service | Contrato |
| --- | --- |
| auth | `/web/auth/login`, `register`, `refresh`, `logout` |
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

Recuperação de senha usa `password-recovery.service.ts`, explicitamente mockado:
nenhum email é enviado. Home, receitas, compras, preferências e demais lacunas
de `frigus-bff/docs/core-api-todo.md` não têm telas ou contrato BFF neste checkout.
Não foram inventadas chamadas para esses recursos nem para `/web/domestic/*`,
que responde 501. Notificações novas da core-api ainda não estão expostas no BFF.

## Validação

`npm run build`, `npm run lint` e `npm test`.

O teste de integração é opt-in e aceita somente a stack descartável local:

```powershell
$env:FRIGUS_INTEGRATION_URL = 'http://localhost:3000'
npm test
Remove-Item Env:FRIGUS_INTEGRATION_URL
```

Ele cria usuários e dados sintéticos no banco local e percorre cadastro,
login, perfil, refresh, planos, checkout simulado, listagens de grupos/conversas/
descartes, assinatura e logout. Não executar apontando o BFF para um banco compartilhado.
Criação de grupo/estoque e envio de chat têm cobertura dos services com transporte
simulado; a cobertura ponta a ponta está marcada como TODO por uma falha de lazy
loading da core-api ao resolver os limites do plano do usuário autenticado.

## Ambiente local usado

Web: `http://localhost:5173`; BFF: `http://localhost:3000`;
core-api: `http://localhost:8080`.

Core-api roda do JAR atual em `frigus-integration-core`, usando os containers
`frigus-integration-postgres` (porta local 5433) e `frigus-integration-redis`
(porta local 6379). O schema foi inicializado com `frigus-core-api/db/script.sql`
somente no banco novo. O banco configurado no `.env` não foi alterado.

Limitações existentes no backend:

- A configuração original não inicia com o banco do `.env`: falta `notifications`.
- Com `spring.jpa.open-in-view=false`, consulta de transação falha com
  `LazyInitializationException` ao acessar `Plan`. O container local usa
  `SPRING_JPA_OPEN_IN_VIEW=true` para permitir a conferência dos contratos.
  A correção definitiva deve manter as leituras/mapeamento dentro de transação
  ou carregar as associações necessárias. Não houve mudança de código na core-api.
- Mesmo com essa configuração, criar grupo retorna 500: `PlanLimitsResolverService`
  acessa o plano da assinatura do usuário carregado pelo filtro de segurança,
  fora da sessão de origem. Esse erro impede validar criação de estoque/chat
  em sequência. Os services propagam o erro real e não retornam mocks nesse caso.
- H2 não suporta diretamente os tipos enum PostgreSQL declarados nas entidades;
  por isso a integração usa PostgreSQL real local.

Para retomar os containers: `docker start frigus-integration-postgres frigus-integration-redis frigus-integration-core`.
O JAR está montado a partir de `frigus-core-api/target`; após alterações nele,
empacote novamente e reinicie o container da core-api.
