# FlowTask — Intelligent Task & Automation Manager

## 1. Introdução

O FlowTask é um sistema de gerenciamento de tarefas que vai além do CRUD tradicional,
aplicando regras de negócio reais, priorização dinâmica e automações inteligentes.

O objetivo não é apenas armazenar tarefas, mas ajudar o usuário a tomar melhores decisões
sobre o que fazer e quando fazer.

---

## 2. Problema

Ferramentas comuns de tarefas tratam todas as atividades como iguais, ignorando:

- prazos críticos
- conflitos de horário
- acúmulo de tarefas atrasadas
- automações recorrentes

Isso resulta em sobrecarga e perda de foco.

---

## 3. Solução

O FlowTask aplica regras de negócio explícitas para:

- priorizar tarefas automaticamente
- impedir conflitos de horário
- sugerir reorganizações
- integrar automações via webhooks

O sistema atua como um apoio ativo à tomada de decisão do usuário.

---

## 4. Arquitetura

- Node.js + Express
- TypeScript
- PostgreSQL
- TypeORM
- Arquitetura modular
- Controllers sem regras de negócio
- Services responsáveis por decisões do domínio

---

## 5. Regras de Negócio

As regras são isoladas e extensíveis, permitindo evolução sem impacto em código existente,
seguindo os princípios do SOLID.

---

## 6. Decisões Técnicas

A stack foi escolhida visando:

- clareza arquitetural
- facilidade de testes
- aderência ao mercado
- foco em regras de negócio

---

## 7. Próximos Passos

- Autenticação com JWT
- Engine de regras de tarefas
- Integração com n8n
- Testes automatizados
