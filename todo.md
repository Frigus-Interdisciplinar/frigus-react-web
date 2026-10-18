# Checklist do Frontend Frigus (v2)

Atualizado sobre `feat/v2` depois de implementar as pendências que podiam ser resolvidas diretamente no código. Itens que dependem de conteúdo externo, publicação ou validação humana seguem explicitamente pendentes.

## Implementado nesta atualização

- [x] Adicionar Context de autenticação com Provider e hook tipado, integrado ao usuário mantido pelo Zustand.
- [x] Criar página 404 com retorno pela navegação do React Router.
- [x] Aplicar carregamento de páginas com `React.lazy` e `Suspense`.
- [x] Criar hook assíncrono tipado com estado de carregamento/erro e cancelamento via `AbortController`; aplicar à consulta de detalhes da receita.
- [x] Versionar a persistência do Zustand e validar os dados do usuário ao hidratar; versionar e migrar o tema legado.
- [x] Validar parâmetros de rota nas três páginas que usam `useParams` antes de consultar ou exibir dados.
- [x] Trocar links internos de login para `Link` e devolver o botão de revelar senha à ordem de tabulação com foco visível.
- [x] Extrair consultas e ações de receitas para `src/services/recipe.service.ts`.
- [x] Usar `useReducer` tipado por `State` e `Action` no fluxo de redefinição de senha.
- [x] Manter chamadas a endpoints sem `dangerouslySetInnerHTML`; conteúdo de API continua renderizado como texto JSX.
- [x] Manter URLs de ambiente documentadas em `.env.example` sem segredos.

## Ainda pendente no código

- [ ] Aplicar a convenção de pastas e `index.tsx` a todos os componentes e páginas; vários arquivos ainda ficam diretamente em `src/components` e `src/pages`.
- [ ] Dividir componentes e páginas extensos, incluindo `CommercialModals` e `EnterpriseModals`.
- [ ] Mover todas as chamadas diretas de `api` em páginas para serviços próprios por domínio e tipar/validar todos os retornos dinâmicos.
- [ ] Completar entidades tipadas por domínio e remover casts ou `unknown` sem validação em telas restantes.
- [ ] Criar schemas tipados por formulário e garantir que todos os dados enviados à API passem por validação e normalização.
- [ ] Validar URLs externas de anúncios antes de usá-las em `href` e `src`.
- [ ] Agrupar estados relacionados de formulários e revisar os fluxos que ainda têm estados paralelos.
- [ ] Completar revisão de dependências e efeitos. O lint ainda aponta 12 usos de estado síncrono em efeitos e uma dependência incompleta em estoque doméstico; também resta um escape desnecessário na expressão de senha.
- [ ] Exibir estados visíveis de carregamento, sucesso e erro em todas as operações assíncronas, com `role="alert"`/`aria-live` conforme o caso.
- [ ] Corrigir e documentar destinos de termos de uso e política de privacidade; o texto aprovado desses documentos não existe no projeto.
- [ ] Completar atributos ARIA, gerenciamento de foco em modais, landmarks e auditoria de `label`/`alt` em todo o app.

## Validação manual e publicação

- [ ] Testar teclado e leitor de tela (NVDA ou VoiceOver), incluindo foco em modais, menus e abas.
- [ ] Medir contraste WCAG 2.1 AA nos temas claro e escuro.
- [ ] Confirmar recarga de rotas internas na hospedagem e testar os fluxos publicados.
- [ ] Demonstrar chunks sob demanda no Network e justificar `useMemo`/`useCallback` com React Profiler.
- [ ] Publicar em Vercel ou GitHub Pages e adicionar a URL pública ao README. Requer conta e conteúdo de ambiente da implantação.
- [ ] Fazer roteiro de apresentação ponta a ponta: três rotas, 404, rota privada, formulário, estados assíncronos, Network/Profiler e leitor de tela.
- [ ] Preservar o histórico de commits convencionais já existente; não criar commits artificiais para cumprir distribuição temporal.
