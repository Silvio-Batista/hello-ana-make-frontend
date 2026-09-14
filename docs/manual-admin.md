# Manual do Painel Administrativo — Hello Ana Make

Este guia explica como usar o painel administrativo da loja: como cadastrar produtos,
categorias, marcas e outras tarefas do dia a dia. Não é preciso saber nada de programação
para seguir este manual.

---

## Como acessar

Acesse o endereço do painel administrativo (`/admin/login`) e entre com seu e-mail e senha
de administrador. Depois de logado, você verá o menu lateral com todas as áreas do painel:

- **Dashboard** — resumo geral: vendas, pedidos recentes, números da loja.
- **Pedidos** — todos os pedidos feitos pelos clientes.
- **Clientes** — lista de clientes cadastrados.
- **Produtos** — o catálogo da loja.
- **Categorias** — as seções do catálogo (ex.: Maquiagem, Skincare).
- **Marcas** — os fabricantes/marcas dos produtos.
- **Cupons** — códigos de desconto.
- **Promoções** — campanhas especiais (ex.: leve 3 pague 2).
- **Recompensas** — brindes por valor de compra.
- **Configurações** — dados da loja, formas de pagamento, integrações.

Este manual foca principalmente em **Produtos**, **Categorias** e **Marcas**, que são a
base de tudo — sem eles, não dá pra vender nada.

---

## Conceitos básicos (leia antes de cadastrar)

Antes de sair cadastrando produto, vale entender 3 conceitos que se confundem fácil:

### O que é uma Categoria?

É a "gaveta" onde o produto fica organizado no site — é o que o cliente vê no menu do topo
(Maquiagem, Olhos, Boca, Rosto, Skincare, Kits...). Toda categoria também aparece como um
filtro de busca. Uma categoria pode ter uma "categoria pai" — por exemplo, "Batom" pode ser
uma subcategoria dentro de "Boca".

**Regra prática:** pense em categoria como "em que prateleira da loja física esse produto
ficaria?".

### O que é uma Marca?

É o fabricante do produto — quem produz (ex.: "Ana Glow", "Skin Ritual", ou uma marca
parceira/terceirizada). Toda a marca tem seu próprio cadastro (nome, logo, site), separado
da categoria.

**Regra prática:** categoria = "tipo de produto". Marca = "quem fez o produto".

Um mesmo produto sempre tem **uma marca** e **uma categoria** — os dois são obrigatórios
pra cadastrar um produto.

### O que é SKU?

SKU (sigla em inglês pra "código de referência do produto") é um **código único** que
identifica exatamente aquela variação específica de um produto — cor, tamanho, versão. É
como o código de barras interno da loja: se dois produtos diferentes tiverem o mesmo SKU, o
sistema vai ficar confuso sobre qual é qual.

**Exemplo:** o batom "Matte Rosa Nude" pode ter duas variantes — uma na cor "Nude" e outra
na cor "Rosa Choque". Cada uma dessas variantes precisa do **seu próprio SKU**, mesmo sendo
o "mesmo produto":

| Variante | SKU sugerido |
|---|---|
| Batom Matte — Nude | `BAT-MATTE-NUDE` |
| Batom Matte — Rosa Choque | `BAT-MATTE-ROSA` |

Não existe uma regra fixa de como montar o SKU — o importante é que **cada variante tenha
um código diferente e fácil de reconhecer**. Um padrão simples que funciona bem: abreviação
do produto + abreviação da variação.

### O que é uma Variante?

É cada "versão" que o produto tem à venda — cor, volume, tamanho. Um produto sempre precisa
de **pelo menos uma variante** pra existir (mesmo que seja só uma, "Padrão"). Cada variante
tem seu próprio SKU, preço e estoque — ou seja, é possível ter uma cor esgotada e outra
disponível no mesmo produto.

### O que é Slug?

É a versão do nome usada na URL do site (sem espaço, sem acento, sem caractere especial).
Exemplo: o produto "Batom Matte Rosa Nude" vira o slug `batom-matte-rosa-nude`, e a página
dele fica em `/produtos/batom-matte-rosa-nude`. **O sistema gera o slug sozinho** conforme
você digita o nome — só mexa nele manualmente se quiser mudar a URL por algum motivo
específico.

---

## Passo a passo: cadastrar uma Marca

Antes de cadastrar produtos de uma marca nova, ela precisa existir no sistema.

1. No menu lateral, clique em **Marcas**.
2. Clique no botão **Nova marca**.
3. Preencha:
   - **Nome** — nome da marca (ex.: "Ana Glow").
   - **Slug** — gerado automático, pode deixar como está.
   - **Descrição** — texto curto sobre a marca (opcional).
   - **Logo** — envie uma imagem clicando no ícone de upload.
   - **Website** — site oficial da marca, se tiver (opcional).
   - **Ativa** — deixe marcado; se desmarcar, a marca fica escondida do site.
4. Clique em **Salvar**.

---

## Passo a passo: cadastrar uma Categoria

1. No menu lateral, clique em **Categorias**.
2. Clique em **Nova categoria**.
3. Preencha:
   - **Nome** — ex.: "Skincare".
   - **Slug** — gerado automático.
   - **Descrição** — texto sobre a categoria (obrigatório).
   - **Imagem** — imagem de capa da categoria (obrigatório, envie pelo botão de upload).
   - **Categoria pai** — só preencha se essa for uma subcategoria de outra já existente.
     Caso contrário, deixe "Nenhuma".
   - **Ordem** — número que define a posição no menu (0 = primeiro). Categorias com número
     menor aparecem antes.
   - **Ativa** — deixe marcado; se desmarcar, some do menu do site.
4. Clique em **Salvar**.

---

## Passo a passo: cadastrar um Produto

Com marca e categoria já cadastradas, agora sim dá pra cadastrar o produto.

1. No menu lateral, clique em **Produtos**.
2. Clique em **Novo produto**.
3. Preencha a seção **Informações básicas**:
   - **Nome** — nome completo do produto.
   - **Slug** — gerado automático a partir do nome.
   - **Descrição curta** — frase resumo, aparece nos cards de produto na listagem.
   - **Descrição** — texto completo, aparece na página do produto.
   - **Marca** — escolha na lista (precisa já estar cadastrada).
   - **Categoria** — escolha na lista (precisa já estar cadastrada).
4. Preencha a seção **Variantes** — pelo menos uma é obrigatória:
   - **Nome** — nome da variante (ex.: "Nude", "30ml", "Padrão" se o produto não tiver
     variação de verdade).
   - **SKU** — código único dessa variante (ver explicação acima).
   - **Estoque** — quantas unidades tem disponível. **Se ficar em 0, a variante fica
     indisponível pra compra automaticamente** — não precisa desativar nada na mão.
   - **Preço** — preço normal de venda.
   - **Preço promocional** — só preencha se estiver em oferta; deixe em branco caso
     contrário.
   - **Cor** / **Hex da cor** / **Volume** — campos opcionais, úteis pra produtos com
     variação de cor (ex.: hex `#E83E8C`) ou tamanho (ex.: "30ml").
   - Pra adicionar outra variante (outra cor, por exemplo), clique em **Adicionar** dentro
     da seção Variantes.
5. Preencha a seção **Imagens**:
   - Clique no botão de upload pra enviar a foto do produto.
   - A **primeira imagem da lista é sempre a foto principal** (a que aparece na listagem).
   - Clique em **Adicionar** pra incluir mais fotos (ângulos diferentes, por exemplo).
6. Preencha **Detalhes e flags** (todos opcionais):
   - **Ingredientes** / **Como usar** — texto informativo, aparece na página do produto.
   - **Destaque** — mostra o produto na seção "Recomendados" da home.
   - **Lançamento** — marca o produto como novidade.
   - **Mais vendido** — marca o produto como best-seller.
7. Clique em **Criar produto**.

Pronto — o produto já aparece no site (desde que tenha pelo menos uma variante com
estoque maior que zero).

### Editando um produto depois

Na lista de **Produtos**, clique em cima do produto que quer editar. O mesmo formulário
abre preenchido — é só alterar o que precisar e salvar de novo. O mesmo vale pra Categorias
e Marcas.

---

## Dicas rápidas

- **Estoque zerado não precisa "desativar" nada** — o produto/variante some da loja sozinho
  quando o estoque chega a 0, e volta a aparecer assim que você atualizar o estoque.
- **Sempre cadastre marca e categoria antes do produto** — o formulário de produto não deixa
  salvar sem os dois escolhidos.
- **SKU não pode se repetir** entre variantes diferentes, nem entre produtos diferentes —
  se der erro ao salvar, é provável que o SKU já esteja em uso.
- **Imagem de capa é sempre a primeira da lista** — se quiser trocar qual foto aparece
  primeiro na listagem, reordene arrastando ou reenviando na ordem certa.
- **Slug não deveria mudar depois que o produto já está no ar** — muda a URL da página e
  quebra links que já foram compartilhados (redes sociais, WhatsApp, etc.).

---

## Outras áreas do painel (resumo rápido)

- **Pedidos** — acompanhe status (pago, enviado, cancelado...), atualize status de envio e
  código de rastreio.
- **Clientes** — veja o cadastro e histórico de compras de cada cliente.
- **Cupons** — crie códigos de desconto (percentual, valor fixo, frete grátis).
- **Promoções** — campanhas especiais que aplicam desconto automaticamente no catálogo.
- **Recompensas** — configure os brindes que o cliente desbloqueia por valor de compra.
- **Configurações** — dados de contato da loja, formas de pagamento aceitas, frete grátis
  a partir de quanto, integrações (gateway de pagamento, frete, Instagram).
