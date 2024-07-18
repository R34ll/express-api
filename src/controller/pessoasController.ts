import { Response, Request } from "express";
import { Pessoas } from "../models/pessoas";


export function countPessoas(request:Request, response:Response):void{
    const pessoas: Pessoas[] = Pessoas.findAll();

    response.json({"Pessoas": pessoas.length})
}

export function getPessoas(request:Request, response:Response):void{
    const pessoas:Pessoas[] = Pessoas.findAll();

    response.send(pessoas);
}
export function getPessoaById(request:Request, response:Response):void{
    response.send("todo")

}
export function removePessoaById(request:Request, response:Response):void{
    response.send("todo")

}

export function createPessoa(request:Request, response:Response):void{
    response.send("todo")

}




