# TODO — Frontend Frigus (v2)

Checklist dos requisitos pendentes do Projeto Interdisciplinar, com base na auditoria do snapshot `origin/feat/v2` (`906df7a`, 16/10/2026).

## Estrutura e responsabilidades

- [ ] Aplicar a convenção de pasta + `index.tsx` a **todos** os componentes e páginas. A auditoria encontrou arquivos fora do padrão em `src/components/` e `src/pages/`.
- [ ] Separar páginas grandes em componentes menores com responsabilidade única.
- [ ] Tirar lógica de negócio e chamadas de serviço de componentes de interface; manter chamadas externas em `src/services/`.
- [ ] Organizar entidades do domínio em `src/types/`, separadas por domínio, e declarar tipos explícitos para props e dados de API.
- [ ] Manter `any` proibido em `src/` e revisar tipos `unknown`/casts para validar dados antes do uso.

## Serviços, formulários e segurança

- [ ] Confirmar que cada recurso de API tem serviço próprio, retorno `Promise<T>` e tratamento `try/catch` com erro útil para a interface.
- [ ] Manter URLs e chaves em variáveis de ambiente; documentar as variáveis necessárias em `.env.example` sem incluir segredos.
- [ ] Criar validação tipada por formulário em `src/utils/`, com tipo, limite de tamanho e mensagem específica por campo.
- [ ] Garantir que todo dado enviado a um serviço passe pela função de validação correspondente.
- [ ] Sanitizar/normalizar entradas textuais conforme o domínio e validar URLs externas antes de usá-las em `href` ou `src`.
- [ ] Preservar renderização de dados via interpolação JSX; não usar `dangerouslySetInnerHTML` com conteúdo externo.

## Estado e efeitos

- [ ] Agrupar campos relacionados de formulários em um único objeto de estado.
- [ ] Atualizar arrays e objetos de forma imutável, sem mutação direta.
- [ ] Revisar cada `useEffect`: dependências explícitas, completas e corretas; conferir efeitos que capturam valores ou funções da renderização.
- [ ] Verificar o comportamento dos efeitos removendo uma dependência por vez, como será feito na avaliação.
- [ ] Usar `useReducer` com tipos `State` e `Action` em union types nos fluxos em que várias atualizações relacionadas tornam o estado difícil de manter.

## Rotas e autenticação

- [ ] Criar uma página 404 para `path="*"`, com ação de retorno usando React Router; não redirecionar toda rota desconhecida para `/home`.
- [ ] Em cada rota com parâmetro, obter o valor com `useParams` e tratar ausência/invalidade antes de consultar serviços.
- [ ] Centralizar o estado de autenticação em Context e proteger páginas com um componente `PrivateRoute` que redirecione para login.
- [ ] Manter navegação com `<Link>`/`useNavigate`; não usar `window.location.href`.
- [ ] Testar acesso direto e atualização do navegador em rotas internas no ambiente publicado.

## Estados assíncronos

- [ ] Para cada operação assíncrona, exibir estados visíveis de carregamento, sucesso e erro no DOM.
- [ ] Anunciar erros com `role="alert"` e atualizações/status de sucesso com região apropriada, como `aria-live`.
- [ ] Evitar `alert()` e garantir que erros não sejam tratados apenas com `console.log`.

## Acessibilidade WCAG 2.1 AA

- [ ] Associar cada campo a um `<label>` via `htmlFor`/`id` ou usar associação semântica equivalente quando exigido pelo componente.
- [ ] Usar `<button>` para ações e não elementos genéricos clicáveis.
- [ ] Garantir `alt` descritivo em imagens informativas e `alt=""` em imagens decorativas.
- [ ] Verificar contraste de pelo menos 4,5:1 para texto normal e 3:1 para texto grande em temas claro e escuro.
- [ ] Garantir foco visível em todos os controles e operação integral por teclado. Remover `tabIndex={-1}` de ações que precisam estar disponíveis na sequência de tabulação, como o botão de exibir senha.
- [ ] Completar modais, menus e abas com atributos ARIA corretos (`aria-expanded`, `aria-controls`, `aria-haspopup`, `aria-selected`, conforme aplicável).
- [ ] Implementar gerenciamento de foco em componentes complexos: mover foco ao abrir e devolvê-lo ao elemento de origem ao fechar; impedir armadilha ou perda de foco.
- [ ] Estruturar todas as páginas com landmarks semânticos (`header`, `main`, `nav`, `footer`) conforme o conteúdo.
- [ ] Fazer revisão ao vivo somente com teclado e com NVDA/VoiceOver, sem perda de contexto.

## Itens extras de React

- [ ] Completar o uso de Context para autenticação com Provider dedicado, hook de consumo tipado e demonstração de como evita prop drilling. A v2 já tem Context para tema (`ThemeProvider`/`useTheme`); falta confirmar que o requisito de autenticação também é atendido.
- [ ] Criar hook assíncrono tipado com `loading`, erro tratado e cancelamento por `AbortController` ao desmontar ou trocar a consulta.
- [ ] Implementar `React.lazy` e `Suspense` por página, com fallback visível.
- [ ] Demonstrar no DevTools Network que cada rota é carregada sob demanda.
- [ ] Justificar `useCallback` e `useMemo` com um caso de performance mensurável e demonstrar a diferença no React DevTools Profiler.
- [ ] Versionar o estado persistido no `localStorage` com campo `_versao`; validar a versão ao carregar e migrar ou descartar os dados incompatíveis com segurança.

## Publicação e histórico

- [ ] Publicar a aplicação no Vercel ou GitHub Pages.
- [ ] Incluir o link público no README e confirmar que a aplicação abre ao vivo, inclusive ao atualizar uma rota interna.
- [ ] Manter pelo menos 20 commits Conventional Commits distribuídos por quatro semanas, com mensagens específicas. **A auditoria da v2 contou 43 commits convencionais no histórico existente**, então preservar esse padrão nos próximos commits.

## Roteiro de validação para apresentação

- [ ] Abrir a aplicação publicada e navegar por pelo menos três rotas.
- [ ] Demonstrar página 404 e retorno pela navegação do React Router.
- [ ] Demonstrar redirecionamento para login ao abrir rota privada sem autenticação.
- [ ] Navegar por formulários e controles sem mouse, mostrando foco visível e mensagens de erro acessíveis.
- [ ] Demonstrar estados de carregamento, sucesso e erro de uma operação real.
- [ ] Mostrar carregamento sob demanda das páginas no Network e otimização no Profiler.
- [ ] Apresentar no código o Context/Provider, o hook de consumo, o `useReducer` e o hook cancelável.
- [ ] Testar pelo menos um fluxo com NVDA ou VoiceOver.
