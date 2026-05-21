 Portfólio de Suporte Técnico + Chatbot Automatizado

Este é o código do meu site profissional de suporte técnico de informática. Ele une uma landing page institucional (onde apresento meus serviços, funcionamento do atendimento e canais de contato) a um sistema de chat online para triagem automatizada de problemas dos clientes.

O objetivo do chatbot é rodar na página, entender a dúvida ou o defeito que o cliente relatar (PC lento, vírus, problema na rede) e sugerir o direcionamento para o atendimento humano via WhatsApp ou telefone de forma rápida.

 🛠️ O que foi usado

Interface (Frontend)
* **HTML5 e CSS3:** Construído do zero, usando variáveis nativas para o gerenciamento de cores (Dark Mode), CSS Grid para os cards de serviços e Flexbox para a estrutura geral.
* **Animações Nativas:** Efeito de *Scroll Reveal* via `IntersectionObserver` no JavaScript para os elementos surgirem na tela conforme o usuário rola a página, e um *infinite ticker* no topo para os serviços em destaque.
* **Fontes:** Syne (títulos principais), IBM Plex Mono (detalhes técnicos e código) e DM Sans (textos de leitura).

 Inteligência e Servidor (Backend)
* **Node.js + Express:** API simples para intermediar a comunicação entre o site e o modelo de linguagem.
* **Groq SDK:** Integração com a API do Groq utilizando o modelo `llama3-8b-8192` para garantir que o chat responda com latência quase zero.
* **Dotenv e Cors:** Para isolar as credenciais da API e liberar o acesso do frontend local.

---

 📂 Estrutura de Arquivos

```text
├── index.html          # Landing page completa e interface do widget de chat
└── backend/
    ├── server.js       # Servidor Express e integração com o Groq
    ├── .env.example    # Modelo de como configurar as chaves locais
    └── package.json    # Dependências do Node
