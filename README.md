# Frigus Web

Frontend React + Vite. O fluxo disponível neste checkout é cadastro, login,
restauração da sessão, logout e recuperação de senha por código de e-mail.

## Executar localmente

1. Inicie PostgreSQL, Redis e core-api com `docker compose up --build` na pasta
   `frigus-core-api`.
2. Em `frigus-bff`, copie `.env.example` para `.env` e execute `npm install` e
   `npm run dev`.
3. Neste projeto, copie `.env.example` para `.env.local`, execute `npm install`
   e `npm run dev`.
4. Abra `http://localhost:5173`.

O BFF usa `http://localhost:8080` como core-api. Para enviar e-mail de
recuperação, configure no serviço local da core-api uma chave e um remetente
verificado da Brevo; sem essas credenciais, o pedido não envia o código.

## Verificação

`npm run build`, `npm run lint` e `npm test`. O teste de integração com a stack
real é opt-in; veja `docs/services.md` antes de apontar para qualquer banco.
