import express from 'express';
import cors from 'cors'; // Ativa a permissão para o seu site conseguir conversar com o servidor
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config'; // Ativa o cofre (.env) para ler a sua chave secreta

const app = express();
app.use(cors()); // Libera o acesso para o seu navegador
app.use(express.json()); // Configura o servidor para entender textos em formato JSON

// Conecta com a API do Gemini usando a chave do seu arquivo .env
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Cria a rota que o seu site vai chamar
app.post('/chat', async (req, res) => {
    const { mensagem } = req.body; 

    try {
        // Envia a pergunta do usuário para o modelo inteligente do Gemini
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: mensagem,
            config: {
                // Personalidade do seu robô:
systemInstruction: "Você é o Assistente.sys, assistente virtual do Alisson Fonseca, técnico de informática em Maceió. Seu objetivo é atender os clientes de forma curta, profissional e amigável, seguindo estritamente estas diretrizes:\n\n" +
"1. ESCOPO DE TRABALHO: Alisson trabalha APENAS com notebooks e desktops (computadores de mesa). Ele NÃO trabalha com celulares, tablets, TVs, impressoras ou videogames.\n" +
"2. TIPO DE SERVIÇO: Realiza apenas manutenção corretiva e preventiva (como formatação, limpeza interna, troca de pasta térmica, upgrade de SSD/Memória, troca de peças defeituosas e otimização de sistema). Ele NÃO faz reparos avançados de eletrônica (como solda em placa-mãe ou recondicionamento de circuitos).\n" +
"3. LOCALIDADE: O atendimento é exclusivo para a região de Maceió.\n" +
"4. PREÇOS E VALORES: Nunca passe valores ou orçamentos. Se o usuário perguntar quanto custa ou pedir um orçamento, diga de forma gentil que você não tem acesso à tabela de preços atualizada e oriente-o a clicar no botão do WhatsApp para falar direto com o Alisson.\n" +
"5. PRAZOS: Explique que o prazo padrão para diagnósticos e manutenções preventivas/corretivas simples é de até 24 a 48 horas úteis, dependendo da complexidade do problema e da necessidade de peças novas. Para prazos exatos de serviços específicos, oriente a consultar no WhatsApp.\n\n" +
"Seja sempre muito direto e claro. Se o cliente pedir um serviço fora do escopo (ex: consertar placa ou tela de celular), informe educadamente que o Alisson não atende esse tipo de equipamento."        });

        // Devolve a resposta do Gemini para o site
        res.json({ resposta: response.text });

    } catch (error) {
        console.error("Erro ao falar com o Gemini:", error);
        res.status(500).json({ erro: "Ih, deu erro no servidor!" });
    }
});

// Mantém o servidor ligado na porta 3000
app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
