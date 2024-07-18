# API de Pessoas
Esta API que gerencia informações de Pessoas, permitindo realizar operações como criação, busca e remoção de registros.

## Iniciar o Projeto

Para iniciar o projeto, siga estes passos:
1. Clone o repositório:
```bash
git clone https://github.com/R34ll/express-api.git
```
2. Instale as dependências:
```bash
npm install
```
3. Inicie o servidor:
```bash
npm run dev
```


# Endpoints Disponíveis

| Método   |      Endpoint      |  Descrição |
|:----------:|:-------------|:------:|
| GET |    /pessoas/:id   |   Retorna uma pessoa pelo seu ID específico.|
| GET | /pessoas?t=search |  Busca pessoas que correspondam a pesquisa. |
| POST | /pessoas	 |     Cria uma nova pessoa com os dados fornecidos. |
| DELETE | /pessoas/:id |    Remove uma pessoa pelo seu ID específico. |


# Coleção do Postman 
Uma coleção do Postman com exemplos de requisições para todos os endpoints acima está disponível [aqui](https://github.com/R34ll/express-api/blob/main/Express-API-Endpoint.postman_collection.json).

# Exemplo JSON
```json
{
  "id": "b19f8f36-7c55-4d8e-a0e7-ee7152a6f4cb",
  "apelido": "jao",
  "nome": "João Silva",
  "nascimento": "1990-01-01",
  "stack": [
    "JavaScript",
    "Node.js",
    "React"
  ]
}
```




