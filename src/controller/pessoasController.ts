import { Response, Request } from "express";
import { Pessoas } from "../models/pessoas";
import { ApiError } from "./errorController";


export function countPessoas(request:Request, response:Response):void{
    const pessoas: Pessoas[] = Pessoas.findAll();

    response.json({"Pessoas": pessoas.length})
}

export function getPessoas(request:Request, response:Response):void{
    const pessoas:Pessoas[] = Pessoas.findAll();

    response.send(pessoas);
}

export function getPessoaById(request:Request, response:Response):void{
    const id: number = parseInt(request.params.id);
    const pessoa: Pessoas = Pessoas.findByid(id);

    response.send(pessoa);
}

export function createPessoa(request:Request, response:Response):void{

    const { apelido, nome, nascimento, stack } = request.body;
    
    const newPessoa:Pessoas = new Pessoas(apelido,nome, nascimento, stack)
    newPessoa.save();

    response.send({"status":"Pessoa saved"});
}


export function removePessoaById(request:Request, response:Response):void{
    const {id} = request.params;

    Pessoas.removeById(parseInt(id));
    
    response.send({"status":"Pessoa removed"});
}



export function searchPessoa(request: Request, response: Response):void{
    const search:any = request.query.t; //remove any
    if(!search){throw new ApiError("Parametro 't' não fornecido na query.",500)}

    const pessoas:Pessoas[] = Pessoas.findAll();

        const result = pessoas.filter(pessoa =>
            pessoa.apelido.toLowerCase().includes(search.toLowerCase()) ||
            pessoa.nome.toLowerCase().includes(search.toLowerCase()) ||
            pessoa.nascimento.toLowerCase().includes(search.toLowerCase()) 
        )

        response.send(result);
}



