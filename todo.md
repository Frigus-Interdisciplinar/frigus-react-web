# TODO — requisitos pendentes do frontend

Branch: `feat/v2`. Atualizado após a rodada adicional de implementação. Itens que dependem de conteúdo aprovado, publicação ou demonstração ao vivo continuam pendentes.

## Implementado nesta rodada

- [x] Aplicar `src/components/<Nome>/index.tsx` e `src/pages/<Nome>/index.tsx` aos arquivos que estavam soltos nas pastas.
- [x] Mover chamadas diretas à API para serviços por recurso; páginas e componentes não chamam `api`.
- [x] Tipar métodos de serviço com `Promise<Tipo>` e adicionar tratamento de erro; centralizar os tipos de anúncios, estoque, receitas, chat, grupos, notificações, listas e operações comerciais em `src/types/`.
- [x] Adicionar validação tipada na fronteira dos serviços para autenticação, checkout, estoque, listas, anúncios, despesas, descartes e convites.
- [x] Validar URLs HTTP(S) de anúncios antes de usá-las em `href`/`src`.
- [x] Agrupar estado relacionado de configurações, checkout e cadastro de alimento; manter updates imutáveis.
- [x] Corrigir dependências dos efeitos encontrados pelo lint; build e lint passam.
- [x] Trocar chaves por índice por IDs/valores estáveis nas listas dinâmicas revisadas.
- [x] Implementar foco inicial, contenção de Tab, Escape e retorno de foco nos modais; adicionar semântica de diálogo, abas ARIA e foco visível global.
- [x] Nomear interfaces para props que ainda estavam declaradas inline e completar controle ARIA/foco do painel rápido de notificações.
- [x] Separar os modais comerciais e empresariais em componentes e pastas próprias, preservando os imports de barrel já utilizados.
- [x] Validar em runtime respostas de autenticação, contexto/grupos, estoque, anúncios, notificações, chat, receitas, listas, despesas, descartes, convites e transações com schemas Zod.
- [x] Agrupar os campos relacionados nos formulários comerciais de convite, perda, compra e cadastro/edição de anúncio, edição de alimento, convite familiar, pagamento e detalhes do lote.
- [x] Agrupar campos de login e cadastro; validar e exibir erros por campo, limitar tamanhos de entrada e anunciar erros e carregamento.
- [x] Associar explicitamente labels e controles em formulários revisados; adicionar limites de tamanho e melhorar o grupo acessível de permissão de convite.
- [x] Completar navegação por setas, Home e End nas abas de listas domésticas e comerciais; acrescentar atributos de estado/diálogo a gatilhos revisados.
- [x] Exibir feedback de sucesso em operações de cadastro/revisão comercial e inclusão doméstica; anunciar o estado de carregamento dos botões envolvidos.
- [x] Remover API direta de páginas sem introduzir `fetch`, `any` ou `dangerouslySetInnerHTML`; `.env` não está versionado.
- [x] Fazer o cadastro seguir para a escolha obrigatória de plano compatível com o tipo de conta; ativar o gratuito e retomar escolha/checkout pendente após novo login.
- [x] Buscar catálogo e preços no backend, iniciar checkout pago e liberar o acesso somente após aprovação da transação; cobrir estados de espera, recusa, erro e aprovação.
- [x] Persistir no Core API o estado de escolha pendente e a transação associada; adicionar a migração Flyway `V018__user_plan_selection.sql` e documentar o fluxo nos READMEs.
- [x] Adicionar cobertura automatizada para cadastro, login, escolha de plano e resultado de checkout.
- [x] Carregar a assinatura ativa do endpoint de planos no perfil, exibir plano/preço/limites reais e apontar a troca de plano para o catálogo atualizado.

## Ainda falta implementar

### Separação e validação

- [ ] Completar schemas tipados, sanitização e mensagens específicas por campo nos formulários restantes; revisar a consistência entre erros de validação e mensagens apresentadas em cada campo.
- [ ] Agrupar em um objeto os campos relacionados dos formulários restantes que ainda mantêm vários `useState` paralelos.
- [ ] Comparar schemas de resposta runtime com contratos atuais do BFF/Core API e ajustar campos opcionais/nulos conforme os payloads reais.
- [ ] Completar estados de carregamento, sucesso e erro para todas as mutações assíncronas. Algumas ações ainda mostram somente o erro ou atualizam a lista sem confirmação explícita.

### Acessibilidade e apresentação

- [ ] Revisar os controles e gatilhos restantes para garantir associações label/campo e atributos ARIA consistentes em todas as rotas.
- [ ] Completar `aria-expanded`, `aria-controls` e `aria-haspopup` nos gatilhos restantes que abrem menus/modais.
- [ ] Conferir landmarks semânticos em todas as rotas e medir contraste de texto nos temas claro e escuro (4,5:1 para texto normal; 3:1 para texto grande).
- [ ] Testar a aplicação sem mouse e com NVDA ou VoiceOver, incluindo foco de abertura/fechamento, abas, menus, mensagens e leitura de contexto.
- [ ] Demonstrar chunks por rota no Network e explicar as otimizações de `useMemo`/`useCallback` com o React DevTools Profiler.
- [ ] Ensaiar o fluxo de apresentação ponta a ponta, incluindo rota privada, 404, validação de formulário, estados assíncronos e acessibilidade.

### Conteúdo e publicação

- [ ] Receber o conteúdo aprovado de Termos de Uso e Política de Privacidade e configurar seus destinos. O projeto não contém os documentos finais.
- [ ] Publicar em Vercel ou GitHub Pages e inserir a URL pública no `README.md`.
- [ ] Testar a publicação, recarga direta de rotas internas e variáveis de ambiente de produção.

### Validação do ambiente local

- [x] Aplicar a migração Flyway `V018__user_plan_selection.sql` no banco local; o histórico Flyway confirma a versão `018` com sucesso.
- [x] Validar na stack local o cadastro pelo BFF, login, retomada da escolha de plano e ativação do plano gratuito até a entrada no painel.
- [x] Confirmar que a escolha de um plano pago abre o checkout demonstrativo com preço vindo do catálogo e aviso explícito de que não há cobrança.
- [ ] Completar um checkout pago local até aprovação/recusa e confirmar retomada após novo login. A tela exige aceitar Termos de Uso e Política de Privacidade, então o teste foi interrompido antes dessa confirmação.
- [ ] Aplicar a migração Flyway `V018__user_plan_selection.sql` no ambiente compartilhado antes de publicar a Core API/frontend atualizados.

## Critérios já atendidos antes desta rodada

- Context de autenticação com Provider/hook tipado integrado ao Zustand e rotas protegidas por `AuthGuard`; `useReducer` tipado na redefinição de senha.
- Hook assíncrono tipado com `AbortController`, lazy loading com `React.lazy`/`Suspense`, 404, validação de `useParams` e persistência versionada.
- `src/` sem `.js`/`.jsx`; histórico com pelo menos 20 commits Conventional Commits distribuídos por mais de quatro semanas.
