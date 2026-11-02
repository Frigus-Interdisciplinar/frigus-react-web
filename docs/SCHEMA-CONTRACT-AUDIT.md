# Auditoria de schemas e chamadas do Web

Data: 2026-10-22. Fontes: metadata de `public` da **FrigusDB Dev** via Supabase MCP; `information_schema.columns` do Postgres do Compose; DTOs, controllers e validações de serviço no Core; schemas das rotas BFF; schemas, serviços e formulários Web. O snapshot em [schema-contracts.snapshot.json](schema-contracts.snapshot.json) guarda as duas estruturas sem dados de usuários ou credenciais.

## Regras usadas

- O campo de uma tabela não vira automaticamente um campo obrigatório no formulário. IDs, usuário, grupo, datas de auditoria, saldo/status derivados e valores com default são resolvidos pela rota ou pelo servidor.
- Colunas nullable retornadas por Jackson podem chegar como `null`. `.optional()` aceita somente ausência: os schemas de resposta agora normalizam `null` para ausência nos campos opcionais; campos essenciais permanecem validados.
- Campos opcionais vazios nos formulários são omitidos do JSON. Um PATCH/PUT parcial preserva o restante; os PUTs completos, como preferências, continuam exigindo o conjunto definido pelo Core.
- Nascimento no cadastro, preço do catálogo e validade do estoque continuam necessários: a API aplica idade mínima, preço positivo e validade obrigatória. Nascimento pode faltar na resposta de usuários legados/Google e em PATCH.
- Quantidades são inteiros, como no banco. Saldo de estoque e ajuste podem ser zero; entradas, saídas, descarte e compras têm regras próprias do serviço.

## Tabela por tabela

Os nullable abaixo descrevem o banco remoto; a coluna de contrato explica quando um DTO/serviço impõe uma regra adicional ou resolve o valor. Não representam uma sugestão para enviar toda a linha SQL no frontend.

| Tabela/view | Contrato e tela | Colunas nullable em public |
|---|---|---|
| `advertisements` | View analítica somente leitura; não é usada como payload de formulário Web. | `destination_url`, `price`, `start_date`, `end_date` |
| `business_expenses` | Despesas/relatório; fornecedor e vínculo de compra opcionais. Criador/grupo vêm da sessão/rota. | `supplier`, `shopping_list_id` |
| `conversation_participants` | Gerenciado pelo Core; leftAt ausente para participantes ativos. | `left_at` |
| `conversations` | Chat; grupo necessário em conversa GROUP, ausente em PRIVATE; última mensagem opcional. | `group_id`, `name`, `pair_key`, `created_at` |
| `discard` | Perdas; motivo opcional, produto e quantidade positiva necessários pelo DTO/serviço. | `reason`, `quantity`, `movement_id` |
| `dm_recipe_performance` | Tabela analítica, gerenciada por processamento de dados; não participa de formulário Web. | `total_suggestions`, `unique_stocks_suggested`, `avg_suggestion_score`, `total_ingredients`, `avg_available_ingredients`, `suggestion_trend_7d`, `suggestion_trend_30d`, `is_domestic_only`, `is_active`, `last_suggested_date`, `created_at`, `updated_at` |
| `dm_stock_health_daily` | Tabela analítica, gerenciada por processamento de dados; não participa de formulário Web. | `total_products`, `fresh_products`, `near_expiration_products`, `expired_products`, `total_quantity`, `daily_inbound`, `daily_outbound`, `daily_adjustments`, `net_movement`, `top_category`, `top_category_quantity`, `unique_users_accessing`, `total_shopping_lists`, `created_at`, `updated_at` |
| `dm_user_ltv` | Tabela analítica, gerenciada por processamento de dados; não participa de formulário Web. | `account_type`, `total_messages`, `total_stock_movements`, `total_requests`, `total_transactions`, `total_spent`, `subscription_status`, `days_active`, `engagement_score`, `activity_frequency`, `churn_risk`, `first_activity_date`, `last_activity_date`, `created_at`, `updated_at` |
| `flyway_schema_history` | Controle de migrações; não possui formulário nem é transportado pelos serviços Web. | `version`, `checksum` |
| `group_invitations` | Família/funcionários; nome opcional; e-mail e papel EDITOR/VIEWER necessários. Token/expiração são gerados. | `name`, `accepted_at`, `revoked_at` |
| `groups` | Família/equipe/contexto; GroupCreate/Update DTOs. Nome necessário ao criar, banner opcional. | `banner_picture`, `deleted_at`, `owner_id` |
| `message_attachments` | Chat/anexos; registros legados permitem nome/tamanho ausentes. Envio novo exige ambos por validação de segurança no MessageService. | `file_name`, `file_size` |
| `message_reactions` | Reações; emoji obrigatório, usuário/mensagem obtidos do contexto e rota. | Nenhuma |
| `message_reads` | Gerenciado pelo Core ao confirmar leitura; nenhuma entrada de formulário. | Nenhuma |
| `messages` | Chat; texto pode ser null em mensagem com anexo. Serviço exige texto OU anexos; normalização de conteúdo não exige texto em anexo. | `content`, `related_shopping_list_product_id`, `created_at` |
| `notifications` | Alertas/notificações; grupo/referência/leitura opcionais; ids/títulos/datas são respostas do Core. | `group_id`, `reference_id`, `deduplication_key`, `read_at`, `deleted_at` |
| `password_reset_tokens` | Recuperação; tokens/expiração/consumo são gerados e tratados no Core; jamais campos exigidos de um formulário. | `consumed_at` |
| `plans` | Catálogo de planos; descrição/intervalo opcionais no banco; benefícios/limites vêm do Core. Cards atuais são apresentação estática. | `description`, `billing_interval`, `deleted_at` |
| `products` | Cadastro de alimento/lote; ProductCreate DTO. Marca e imagem opcionais; nome/categoria/local/preço/unidade necessários. | `brand`, `image_url`, `owner_group_id` |
| `recipe_favorites` | Favoritos; ids definidos por sessão e rota. Sem campos extras obrigatórios no formulário. | Nenhuma |
| `recipe_ingredients` | Detalhe de receita; quantidade/unidade opcionais, disponibilidade derivada; nenhum formulário de criação. | `quantity`, `unit` |
| `recipe_suggestions` | Sugestões; validade mais próxima/score opcionais; contagens calculadas no Core. | `nearest_expire_date`, `score` |
| `recipes` | Receitas; descrição/instruções opcionais; favorite é derivado por usuário. Não há formulário de criação neste Web. | `description`, `instructions` |
| `requests` | Tabela de pedidos; descrição/foto/conversa/mensagem opcionais. Não há formulário/rota de criação usado pelo Web atual. | `description`, `picture`, `conversation_id`, `message_id` |
| `shopping_list_products` | Itens de compra; preço pago/notas opcionais no banco; id/produto/quantidade exigidos no DTO, status calculado/incremental. | `purchased_unit_price`, `notes` |
| `shopping_lists` | Compras; data/fornecedor opcionais. Nome é exigido pelo DTO embora haja default SQL; total e conclusão são calculados. | `supplier`, `completed_at`, `total` |
| `stock_movements` | Movimentação/histórico; observação opcional. Zero é válido para ADJUSTMENT; IN/OUT exigem inteiro positivo. | `date`, `observation`, `balance_after` |
| `stock_products` | Estoque/detalhe do lote; StockProductCreate/Update DTOs. Código e mínimo opcionais; saldo inicial/status/categoria são calculados no Core. | `minimal_quantity`, `product_status`, `purchase_unit_price`, `deleted_at`, `batch` |
| `stocks` | Estoque doméstico/comercial; StockCreate DTO. groupId + nome necessários. | `deleted_at` |
| `subscriptions` | Assinatura; datas de fim/cancelamento opcionais. Ids e status gerados no Core; nenhuma entrada direta. | `current_period_end`, `canceled_at`, `deleted_at` |
| `transaction_events` | Histórico de processamento; mensagem opcional. Sem formulário. | `message` |
| `transactions` | Checkout; plano gratuito pode omitir método. Plano pago exige método e dados fictícios correspondentes no serviço. Campos das outras formas de pagamento são opcionais. Valores/status são do servidor. | `subscription_id`, `fake_card_last4`, `fake_pix_key`, `queue_job_id`, `error_message`, `queued_at`, `processed_at` |
| `user_groups` | Gerenciado pelo Core ao criar grupo/adicionar membro; ids e permissões vêm do contexto. | Nenhuma |
| `user_preferences` | Configurações; PUT envia todas as preferências. Defaults SQL são para criação, não substituem campos de uma atualização completa. | Nenhuma |
| `users` | Login, cadastro e perfil; Auth/User DTOs. Cadastro exige nascimento pela idade mínima; respostas e PATCH aceitam ausência. | `birth_date`, `deleted_at`, `hash_password`, `senha`, `google_id`, `profile_picture_url` |
| `vw_dm_group_summary` | View analítica somente leitura; não é usada como payload de formulário Web. | `group_id`, `group_name`, `created_date`, `members`, `stocks`, `active_items`, `expiring_7d`, `expired_items` |
| `vw_dm_stock_health` | View analítica somente leitura; não é usada como payload de formulário Web. | `stock_id`, `stock_name`, `group_id`, `group_name`, `active_items`, `total_qty`, `expired_items`, `expiring_7d`, `below_minimal`, `in_30d`, `out_30d` |
| `vw_dm_user_summary` | View analítica somente leitura; não é usada como payload de formulário Web. | `user_id`, `user_name`, `account_type`, `signup_date`, `messages`, `movements`, `requests`, `last_activity_date`, `subscription_status`, `engagement_score` |
| `vw_top_ingredients_analytics` | View analítica somente leitura; não é usada como payload de formulário Web. | `popularity_rank`, `category_rank`, `product_id`, `name`, `category`, `suggestion_count`, `unique_stocks`, `avg_suggestion_score`, `unit_price`, `percentage_of_total_suggestions`, `top_ingredient_in_category`, `last_suggested_date`, `view_updated_at` |
| `vw_user_engagement_analytics` | View analítica somente leitura; não é usada como payload de formulário Web. | `id`, `name`, `account_type`, `user_created_at`, `total_messages`, `total_stock_movements`, `total_requests`, `messages_last_30d`, `movements_last_30d`, `engagement_score`, `message_rank`, `movement_rank_by_type`, `activity_recency_rank`, `overall_last_activity`, `days_since_activity` |

## Divergências reais entre os bancos

A aplicação em `localhost:5173` usa o Postgres local do Compose. A FrigusDB Dev foi inspecionada como referência adicional; os testes de mutação usam somente a conta de demonstração local.

- `users.hash_password`: Dev nullable=YES; Compose nullable=NO. O schema de transporte considera também a validação do DTO e registros legados.

A Dev possui tabelas/views analíticas e a coluna legada `users.senha` que não fazem parte da autenticação atual: o Core usa `public.users.hash_password`.

## Correções aplicadas

- Tema do Tailwind baseado na classe `.dark`, com `color-scheme` para controles nativos. Funções do ThemeProvider estáveis impedem recarregamentos de preferências a cada render.
- Respostas de produto/lote, grupos/membros, conversas vazias, anexos, usuário sem nascimento, receitas, anúncios e compras aceitam seus metadados nullable.
- Preservação de `batch`, `initialQuantity`, marca, imagem e observação no caminho Web → BFF → Core. Uso de `memberRole/isOwner` reais da API.
- Nome opcional nos convites doméstico/comercial; falhas de envio deixam de aparecer como sucesso.
- Cadastro envia `dd/MM/yyyy`, valida data real/idade e usa a política de senha do Core também na recuperação.
- Schemas de entrada do BFF extraídos das rotas para `src/schemas/core-api.schema.ts` e reaproveitados no inventário mobile, evitando divergência nos mesmos endpoints.
- Campos opcionais de anúncio, fornecedor, motivo, código/mínimo de lote e metadados de pagamento não precisam de valores artificiais. O código do lote pode ser informado ou omitido no modal comercial.

## Evidência do banco remoto

A consulta de nulabilidade encontrou 81 produtos sem marca, 82 sem imagem, 6.368 itens de estoque sem mínimo e 1.954 mensagens sem conteúdo textual. Há 10 usuários sem nascimento. Esses registros não podem ser rejeitados pelos schemas de resposta.

## Verificação

- `tests/contracts.test.ts`: pares de entrada Web/BFF, opcionais omitidos/null/vazios, campos essenciais, regras numéricas, datas e respostas nullable.
- `tests/contracts.live.test.ts`: chamadas pelo proxy `/api/web` do Nginx usando a conta de demonstração; adiciona/edita produto, movimentação, lista, mensagem, descarte, despesa, anúncio e checkout fictício. Troca o tipo da conta somente no Postgres local durante os cenários comercial/empresarial e o restaura em `finally`.
- Os e-mails de convite durante o teste são enviados a um capturador HTTP local com override temporário do Compose. A entrega externa por Brevo não é simulada como evidência de entrega real.
- As respostas/status de cada chamada são gravados em [stack-contract-results.json](stack-contract-results.json) após a execução.

### Resultado em 22/10/2026

- Web: build Docker, lint e TypeScript da aplicação e dos testes passaram; **39 testes de contrato passaram**.
- Integração pelo Nginx/Web → BFF → Core: **13 cenários passaram**, com **63 chamadas HTTP**; 62 respostas de sucesso e um HTTP 400 esperado para código de recuperação incorreto. A senha da conta foi preservada.
- Core: build com Java 17 passou; **8 testes de FrigusAiClientTest passaram**, cobrindo sessão, autenticação no provedor, respostas inválidas, indisponibilidade e timeout.
- O teste de IA exige uma sessão e uma resposta textual não vazias. Também houve resposta pela interface com os produtos reais do estoque local.
- Finalização: sete serviços do Compose saudáveis, login/perfil/contexto revalidados após restaurar o Compose base; capturador encerrado e conta novamente DOMESTIC.
- A interface cadastrou um alimento sem metadados opcionais, editou nome/quantidade e preservou os dados após reload. Quantidade fracionada é rejeitada sem arredondamento silencioso ou fechamento do formulário.
- Compras pela interface: inclusão do produto, aumento de quantidade e marcação como comprado persistidos. Chat: mensagem enviada e listada. Família: convite com nome vazio aceito e capturado localmente.
- Tema claro confirmado com fundo `rgb(245, 248, 252)` e tema escuro com `rgb(17, 18, 20)`; escolha clara preservada ao navegar, salvar preferências e recarregar.
- Navegação exercitada nas áreas doméstica, comercial e empresarial, formulários públicos e checkout. As etapas 2/3 da recuperação redirecionam corretamente quando faltam os dados da etapa anterior. Os snapshots estão em [browser-contract-results.json](browser-contract-results.json); a navegação isolada não comprova a submissão de cada botão.

Os testes descobriram e corrigiram falhas além da validação Zod:

- Lazy loading fora de transação na listagem de conversas, histórico de mensagens e consulta de transações: transações de leitura nos serviços.
- Relatório mensal: parâmetro de enum na consulta de listas concluídas, removendo cast incompatível com o Postgres.
- `/shopping-lists/suggestions`: rota estática registrada antes de `/:id` no BFF.
- Nginx: resolução dinâmica do BFF no Docker para evitar IP antigo após recriação.
- IA: HTTP/1.1 no cliente Java e timeouts coerentes; Postgres, Redis e Mongo locais no Compose para o cenário de desenvolvimento.

### Repetir

Na pasta `frigus-react-web`, com o Compose saudável:

```powershell
npm run lint
node node_modules/typescript/bin/tsc -p tsconfig.app.json --noEmit
node node_modules/typescript/bin/tsc -p tsconfig.tests.json --noEmit
node node_modules/vitest/vitest.mjs run tests/contracts.test.ts --maxWorkers=1

$env:RUN_STACK_CONTRACTS='1'
$env:FRIGUS_TEST_PASSWORD='<senha da conta de demonstração local>'
node node_modules/vitest/vitest.mjs run tests/contracts.live.test.ts --maxWorkers=1 --testTimeout=30000 --hookTimeout=30000
```

O teste de integração cria registros de demonstração no banco local; pode ser repetido sem apagar os dados existentes. Não aponte para um ambiente remoto. Para incluir os cenários de e-mail, execute o capturador `.frigus-runtime/email-capture.mjs` na raiz, aplique o override temporário `.frigus-runtime/compose.email-test.yml` e defina `FRIGUS_EMAIL_CAPTURE=1`. Ao terminar, restaure o Compose base e encerre o capturador. Sem essa flag, a entrega de convites/recuperação não é exercitada.

## Pendências fora dos contratos corrigidos

- Cards de planos e o resumo da assinatura no perfil ainda têm textos/valores estáticos; devem consumir catálogo e assinatura. A assinatura PLUS local usada nos testes não deve ser inferida desses textos.
- Os botões de edição de dados pessoais, alteração de senha e exclusão da conta em Configurações ainda precisam do fluxo funcional correspondente. Este teste não excluiu conta nem trocou a senha do usuário.
- Upload externo de foto/anexo e entrega real por Brevo não foram exercitados nesta rodada. Os contratos nullable de anexos foram testados com fixtures; envio de e-mail usou captura local.
- A chave de IA local está vinculada à conta de demonstração. O serviço de IA identifica o usuário/estoque pela chave; o uso com outras contas precisa de credencial/contexto por usuário.
- Métricas analíticas e tendências sem endpoints usados pelo Web permanecem fora dos formulários. O mapeamento de suas tabelas/views está registrado acima.

