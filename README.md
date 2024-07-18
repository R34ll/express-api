# API de Pessoas
Esta API que gerencia informações de Pessoas, permitindo realizar operações como criação, busca e remoção de registros.

# Endpoints Disponíveis

| Método   |      Endpoint      |  Descrição |
|:----------:|:-------------|:------:|
| GET |    /pessoas/:id   |   Retorna uma pessoa pelo seu ID específico.|
| POST | /pessoas	 |     Cria uma nova pessoa com os dados fornecidos. |
| DELETE | /pessoas/:id |    Remove uma pessoa pelo seu ID específico. |
| GET | /pessoas?t=search |  Busca pessoas que correspondam a pesquisa. |


# Coleção do Postman 
Uma coleção do Postman com exemplos de requisições para todos os endpoints acima está disponível [aqui](https://github.com/R34ll/express-api/blob/main/Express-API-Endpoint.postman_collection.json).

# Exemplo JSON
```json
{
  "id": 1,
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




