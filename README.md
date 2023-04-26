# Next CMS 


[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

![image](https://user-images.githubusercontent.com/53949076/234661171-bf15de74-b77e-43fc-b0e9-317ec58067cf.png)


Next CMS é uma aplicação de blog desenvolvida com a arquitetura JAMStack, utilizando o framework Next.js, o CMS Prismic, o banco de dados FaunaDB e o serviço de pagamento Stripe. A autenticação é feita com NextAuth utilizando a autenticação do GitHub.

## Tecnologias utilizadas

- [Next.js](https://nextjs.org/) - Framework de React para desenvolvimento de aplicações web do lado do servidor.
- [Prismic](https://prismic.io/) - CMS (Content Management System) para gerenciamento de conteúdo.
- [FaunaDB](https://fauna.com/) - Banco de dados distribuído e servidorless para aplicações modernas.
- [Stripe](https://stripe.com/) - Plataforma de pagamentos online para negócios.
- [NextAuth](https://next-auth.js.org/) - Biblioteca para autenticação de usuários em aplicações Next.js.

## Configuração do ambiente

Antes de executar a aplicação, você precisará configurar as seguintes variáveis de ambiente:

### Chaves do Stripe

```
STRIPE_API_KEY=
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=
STRIPE_SUCCESS_URL=http://localhost:3000/posts
STRIPE_CANCEL_URL=http://localhost:3000/
STRIPE_WEBHOOK_SECRET=
```

### Chaves do GitHub

```
GITHUB_ID=
GITHUB_SECRET=
```

### Chave do FaunaDB

```
FAUNADB_KEY=
```

### Chaves JWT

```
JWT_SECRET=`openssl rand -base64 64`
JWT_SIGNING_KEY=`npx node-jose-tools newkey -s 256 -t oct -a HS512`
JWT_ENCRYPTION_KEY=`npx node-jose-tools newkey -s 256 -t oct -a A256GCM -u enc`
```

### Chave do Next

```
AUTH_SECRET=`openssl rand -base64 64`
```

### Chave do Prismic

```
PRISMIC_SECRET=
```

## Mais Informações

Antes de executar a aplicação Next CMS localmente, é necessário configurar as variáveis de ambiente. Você pode configurá-las no arquivo `.env` do projeto, preenchendo os valores adequados para as variáveis relacionadas ao Stripe, Github, FaunaDB, JWT e Prismic.

Além disso, para que a integração com o Stripe funcione corretamente, é necessário instalar o pacote do Stripe no terminal e executar o seguinte comando:

```bash
stripe listen --forward-to localhost:3000/api/webhooks
```

## Licença

O Next CMS é um projeto de código aberto sob a [Licença MIT](LICENSE).
