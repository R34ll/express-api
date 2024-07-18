import { Response, Request } from "express";
import { Pessoas, Stack } from "../models/pessoas";
import { ApiError } from "./errorController";


// Número total de Pessoas encontradas.
export function countPessoas(request: Request, response: Response): void {
    const pessoas: Pessoas[] = Pessoas.findAll();

    response.json({ "Pessoas": pessoas.length })
}


// retorna todas as Pessoas da base de dados.
export function getPessoas(request: Request, response: Response): void {
    const pessoas: Pessoas[] = Pessoas.findAll();

    response.status(200).send(pessoas);
}

// retorna uma Pessoa pelo seu ID.
export function getPessoaById(request: Request, response: Response): void {
    const id: string = request.params.id;
    const pessoa: Pessoas = Pessoas.findByid(id);

    response.status(200).send(pessoa);
}

// Cria uma nova Pessoa e guarda-a na "database".
export function createPessoa(request: Request, response: Response): void {

    const { apelido, nome, nascimento, stack } = request.body;

    const newPessoa: Pessoas = new Pessoas(apelido, nome, nascimento, stack)
    newPessoa.save();


    response
        .status(201)
        .header('Location', `/pessoas/${newPessoa.id}`)
        .send({ "status": "Pessoa salva com sucesso." });
}


// Remove uma pessoa pelo seu ID.
export function removePessoaById(request: Request, response: Response): void {
    const { id } = request.params;

    Pessoas.removeById(id);

    response.send({ "status": "Pessoa removida com sucesso." });
}



//  Pesquisa pessoas com base nos parâmetros apelido, nome e data de nascimento.
export function searchPessoa(request: Request, response: Response): void {
    const search: any = request.query.t; //remove any

    const result = Pessoas.searchPessoas(search);

    response.status(200).send(result);
}



