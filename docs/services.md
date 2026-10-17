# Frontend web → BFF

`VITE_API_URL` aponta para a raiz do BFF (local: `http://localhost:3000`).
Services usam `/web/*`, cookies com `withCredentials` e schemas Zod para validar
requests e responses. Não há fallback automático para mocks quando a API falha.

## Rotas e integrações

| Rota | Recursos conectados |
| --- | --- |
| `/login`, `/register`, `/forgot-password` | Cadastro, login, sessão, logout e recuperação de senha por código de e-mail. |
| `/home` | Resumo do estoque, validade próxima e contagem de notificações. |
| `/stock` | Grupos/estoques, catálogo, itens, entradas, consumo e descartes. |
| `/shopping-list` | Listas, itens, sugestões de reposição, compra, conclusão e limpeza. |
| `/recipe` | Busca, catálogo, sugestões da API e favoritas. |
| `/family-members` | Grupos, convites, papéis e remoção de membros. |
| `/chat` | Conversas privadas/de grupo, histórico, busca textual, reações e anexos. |
| `/settings` | Perfil, foto, senha, preferências e notificações não lidas. |
| `/plans` | Planos, checkout, histórico/cancelamento de transações e assinatura. O processador de pagamento ainda é demonstrativo. |
| `/commercial` | Despesas, relatório mensal, equipe e anúncios empresariais. |

## Chat e anexos

O upload solicita um ticket autenticado ao BFF e envia o arquivo diretamente ao
Supabase Storage. O BFF provisiona o bucket privado `chat-attachments` no primeiro
upload; tipos permitidos: JPG, PNG, WebP e PDF, com até 10 MB por arquivo e cinco
arquivos por mensagem. O Core API persiste os metadados. O BFF gera URLs assinadas
de leitura com validade de 24 horas ao retornar mensagens.

A busca é textual por conversa. Reações disponíveis: 👍 ❤️ 😂 😮 😢 🙏. O Core API
persiste cada reação por usuário e mensagem.

## Checkout

O frontend chama `POST /web/transactions/checkout` com uma chave de idempotência,
acompanha o estado da transação e permite cancelar uma transação pendente. A API
atual só simula o processador: não cobra cartão e não gera código PIX ou boleto.
Para cobranças reais, configure um adquirente no backend.

`/web/domestic/*` responde 501 de propósito. As telas domésticas usam contratos
tipados sob `/web/core` para evitar o antigo estado em memória.

## Validação

`npm run build`, `npm run lint` e `npm test`.

O teste de integração é opt-in e aceita somente a stack descartável local:

```powershell
$env:FRIGUS_INTEGRATION_URL = 'http://localhost:3000'
npm test
Remove-Item Env:FRIGUS_INTEGRATION_URL
```

Ele cria usuários e dados sintéticos no banco local; não execute contra um banco
compartilhado.
