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
    response.send("todo")
}





