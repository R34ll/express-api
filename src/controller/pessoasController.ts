import { Response, Request } from "express";
import { Pessoas, Stack } from "../models/pessoas";
import { ApiError } from "./errorController";


// Número total de Pessoas encontradas.
export function countPessoas(request: Request, response: Response): void {
    const pessoas: Pessoas[] = Pessoas.findAll();

    response.json({ "Pessoas": pessoas.length })
}


// retorna todas as Pessoas da base de dados.
export async function getPessoas(request: Request, response: Response): Promise<void> {
    const pessoas: Pessoas[] = await Pessoas.findAll();

    response.status(200).send(pessoas);
}


export async function getPessoaById(request: Request, response: Response): Promise<void> {
    try {
        const id: string = request.params.id;
        const user_id = Number(id)
        const pessoa = await Pessoas.findById(user_id);
    
        response.status(200).send(pessoa);        
    } catch (error:any) {
        response.status(500).send({ "Controller Error": error.message });
        
    }

}

export async function createPessoa(request: Request, response: Response): Promise<void> {
    const { apelido, nome, nascimento, stack } = request.body;

    const newPessoa: Pessoas = new Pessoas(apelido, nome, nascimento, stack)
    await newPessoa.save();


    response
        .status(201)
        .header('Location', `/pessoas/${newPessoa.id}`)
        .send({ "status": "Pessoa salva com sucesso." });
}


// Remove uma pessoa pelo seu ID.
export async function removePessoaById(request: Request, response: Response): Promise<void> {
    const { id } = request.params;
    var user_id: number = Number(id); 

    try {
        await Pessoas.removeById(user_id);
        console.log("Res: ", id)
        response.send({ "status": "Pessoa removida com sucesso." });
    } catch (error: any) {
        // Handle the error appropriately
        response.status(500).send({ "error": error.message });
    }
}


//  Pesquisa pessoas com base nos parâmetros apelido, nome e data de nascimento.
export function searchPessoa(request: Request, response: Response): void {
    const search: any = request.query.t; //remove any

    const result = Pessoas.searchPessoas(search);

    response.status(200).send(result);
}



