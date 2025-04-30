# Sensedia Frontend Challenge

Este repositório contém a solução do desafio técnico proposto para a vaga de Desenvolvedor Front-end na Sensedia. Com foco na criação de uma interface para gerenciamento de usuários. O sistema possui páginas dinâmicas e utiliza práticas modernas de desenvolvimento como validação com Zod e controle de dados de usuários, incluindo a cidade, dias da semana e status de bloqueio atráves de um BFF.

## 💡 Visão Geral

A aplicação simula um sistema de gerenciamento de usuários, com páginas para listagem, cadastro e visualização de perfil, utilizando uma API externa como base de dados. O projeto implementa diversas features propostas no desafio e adiciona algumas soluções estratégicas para tornar o sistema mais completo e funcional.

## 🧩 Estrutura das Páginas


- **Página inicial**: Permite escolher para qual parte do sistema o usuário deseja ir.
- **Página de Tabela de Usuários (/users)**: Lista os usuários e permite bloqueá-los (remoção lógica).
- **Página de Registro de Novo Usuário (/users/new)**: Formulário completo com validações e controle de cidade, dias da semana e bloqueio.
- **Página de Detalhes do Usuário (/user/[id])**: Página dinâmica com as informações completas do usuário.

🚀 Tecnologias Utilizadas

- **Next.js** (App Router)
- **React Server Components**
- **TailwindCSS**
- **Zod** – para validação robusta dos dados no formulário
- **React Hook Form** – para controle dos inputs
- **Lucide Icons** – para ícones do sistema
- **Axios** – para consumo da API
- **Jest + Testing Library** – testes unitários
- **TypeScript** – para segurança de tipos em toda a aplicação

## 🧠 Estratégias de Implementação
Para centralizar e simplificar o controle de algumas informações que a API original não fornecia diretamente (como cidade, dias da semana e status de bloqueio), foi implementado um BFF interno. Essa abordagem permitiu:

- Registrar cidade e dias da semana apenas no momento da criação de novos usuários.

- Exibir esses dados mesmo para usuários antigos, via populate simulado, garantindo que a listagem fique completa.

- Usar o campo blocked como uma espécie de "deleção lógica", filtrando da listagem principal os usuários desativados.

## ✅ Diálogo e Toast Personalizados
Modal de confirmação próprio ao tentar bloquear um usuário.

Toast customizado para alertar o usuário sobre ações realizadas (ex: criação de usuário, erro, etc).

## ✅ Roteamento e UI
- As rotas foram organizadas para garantir navegação fluida e intuitiva entre listagem, criação e perfil.

- A página dinâmica /user/[username] trata usuários inexistentes de forma elegante.

- Header adaptado por página e breadcrumb funcional conforme a navegação.


## 📋 Funcionalidades Implementadas
### Tabela de Usuários
- istagem com todos os campos exigidos no layout.

- Ícone de lixeira aparece apenas ao passar o mouse.

- Modal de confirmação ao clicar para bloquear.

- Campo de busca funcional por nome ou username (Bônus 1).

- Header fixo ao topo ao rolar (Bônus 2).

### Formulário de Novo Usuário
- Envio dos dados com validação via Zod.

- Redirecionamento com revalidação após criação.

- Processamento server side (Bônus 1)

- Agrupamento dinâmico de dias da semana (Bônus 2).

- Validação de todos os campos (Bônus 3).

- Estilização dos inputs e seletores conforme layout (Bônus 4).

### Página Dinâmica do Usuário
- Rota dinâmica baseada no username.

- UI de fallback enquanto os dados são carregados (Bônus 1).

- Header adaptado por página (Bônus 2).

### Extras
- Breadcrumbs funcional indicando a rota atual.

- Menu suspenso no canto superior direito com as iniciais do usuário como avatar 
  - com dedução das iniciais (Bônus).

- Estrutura de código clara, modular e testável.


## 🧪 Testes
Foram escritos testes unitários para as funções utilitárias e para os serviços (como o serviço BFF de usuários), garantindo que a lógica esteja correta e desacoplada da interface.

## 📂 Organização de Pastas
```bash
/src
  ├── app/               # Estrutura de rotas e páginas (App Router)
  ├── components/        # Componentes reutilizáveis (ex: Dialog, Toast, Header)
  ├── features/          # Lógica de cada feature (ex: UserTable, UserForm)
  ├── lib/               # Funções auxiliares (ex: getInitials, formatDays)
  ├── services/          # Comunicação com a API e lógica BFF
  ├── validations/       # Schemas com Zod
/tests                   # Testes unitários com 
```

## ▶️ Como Rodar o Projeto
1. Clone este repositório:
   ```bash
   git clone https://github.com/sidneyLimaDev/sensedia-frontend
   ```
2. Acesse o diretório do projeto:
   ```bash
   cd chatbot
   ```
3. instale o projeto:
   ```bash
   npm intall
   ```
4. crie  as variaveis no arquivo `.env`
    ```bash
    NEXT_PUBLIC_API_URL=
    NEXT_PUBLIC_SUPABASE_URL=
    NEXT_PUBLIC_SUPABASE_ANON_KEY=

    ```
5. Execute o o projeto:
   ```bash
   npm run dev
   ```