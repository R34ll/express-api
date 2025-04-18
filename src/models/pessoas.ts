import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../database/prisma';


import { ApiError } from '../controller/errorController';
import { Pessoa } from '@prisma/client';


// Stacks permitidas em uma lista previsível de tecnologias já estabelecidas,
// facilitando consultas futuras e evitando vulnerabilidades ao impedir a
// inserção direta de dados de usuários no "banco de dados".
export enum Stack {
    Node = "node",
    Express = "express",
    Typescript = "typescript",
    Javascript = "javascript",
    Rust = "rust",
    CSharp = "c#",
    CPlusPlus = "c++",
    C = "c",
    PHP = "php",
    Python = "python",
    Java = "java",
    Oracle = "oracle"
}


// Classe representando a entidade Pessoa
export class Pessoas {
    public readonly id: string // Unico
    public readonly username: string // Unico
    public readonly nome: string;
    public readonly nascimento: string;
    public readonly stacks: Set<Stack>;



    constructor(username: string, nome: string, nascimento: string, stack: Set<Stack>) {
        //  Validação parametros não vazios
        if(!username || !nome || !nascimento){
            throw new ApiError("Preencha todos os campos.",422 );
        }

        //  Validação tamanho Stack
        if (stack.size > Object.keys(Stack).length) {
            throw new ApiError(`Tamanho de stacks '${stack.size}' invalido.`, 422 );
        }

        // Validação items Stack
        for (const item of stack) {
            if (!Object.values(Stack).includes(item.toLowerCase() as Stack)) {
                throw new ApiError(`Valor de '${item}' invalido.`, 422 );
            }
        }

        // Validação tamanho do apelido
        if (username.length > 30) {
            throw new ApiError("'apelido' deve ter menos de 30 caracteres.", 422 );
        }

        // Validação de apelido unico.
        if(Pessoas.findByApelido(username)){
            throw new ApiError("'apelido' já usado por outra pessoa.", 404  );
        }

        // validação tamanho do nome
        if (nome.length > 100) {
            throw new ApiError("'nome' deve ter menos de 30 caracteres.", 422 );
        }

        // Validação data no formato correto (YYYY-MM-DD)
        if (!(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(nascimento))) {
            throw new ApiError("Formato da data de nascimento errada. Siga o formato YYYY-MM-DD", 422 );
        }



        this.id = uuidv4(); 
        this.username = username;
        this.nome = nome;
        this.nascimento = nascimento;
        this.stacks = stack;

    }


    public static async findAll(): Promise<Pessoas[]|any> {
        try {
            // const data = fs.readFileSync(dataPath, 'utf-8');
            // const pessoas: Pessoas[] = JSON.parse(data);

            const pessoas: Pessoas[] = await prisma.pessoa.findMany();
            console.log("Pessoas: ", pessoas)
            return pessoas;
        } catch (error) {
            throw new ApiError(`Erro ao tentar ler arquivo local de dados: ${error}`, 404 )
        }
    }

        public static async findById(id: number): Promise<Pessoas|any> {
            if (!id || isNaN(id)) {
                throw new ApiError("ID inválido. Forneça um ID numérico válido.", 400);
            }
        
            try {
                const pessoa = await prisma.pessoa.findUnique({
                    where: { id }
                });
        
                if (!pessoa) {
                    console.warn(`Pessoa com id '${id}' não encontrada.`);
                    throw new ApiError(`Pessoa com id '${id}' não encontrada.`, 404);
                }
        
                console.warn("Pessoa encontrada:", pessoa);
                return pessoa;

            } catch (error: any) {
                console.error("Erro ao buscar pessoa:", error);
                
                if (error instanceof ApiError) {
                    throw error; 
                }
                
                if (error.code === 'P2025') { 
                    throw new ApiError(`Pessoa com id '${id}' não encontrada.`, 404);
                }
            }
        } 

    public static async findByApelido(username:string):Pessoas|undefined{
        const pessoas = Pessoas.findAll();
        const pessoa: Pessoas|undefined = await pessoas.find(p => p.username === username);

        return pessoa;
    }

    public static async searchPessoas(search_: string): Promise<Pessoas[]| null> {
        if (!search_) { throw new ApiError("Parametro 't' não fornecido na query.", 500) }
        const search = search_.toLocaleLowerCase(); 

        try {
            const pessoas: Pessoas[] = await this.findAll();
            console.log("P: ", pessoas[0].stack)
 
            const result = pessoas.filter(pessoa =>
                pessoa.username.toLowerCase().includes(search)  ||
                pessoa.nome.toLowerCase().includes(search) ||
                pessoa.nascimento.toLowerCase().includes(search) ||
                Array.from(pessoa.stack).filter(stack => stack?.toLowerCase().includes(search))
            );

            console.log("Result::: ", result)

            return result;
        } catch (error) {
            throw new ApiError(`Erro ao tentar buscar pessoas: ${error}`, 201);
        }
    }


    public async save(): Promise<void>{
        try {

            await prisma.pessoa.create({
                data: {
                    username: this.username ,
                    nome: this.nome,
                    nascimento: this.nascimento,
                    stack: JSON.stringify(this.stacks)
                }
            })
        } catch (error: any) {
            if (error.code === 'P2002') { 
              throw new ApiError(`Apelido "${this.username}" já está em uso`, 422);
            }
            throw new ApiError(`Erro interno: ${error}`, 500);
          }
    }
    public static async removeById(id: number): Promise<void> {
        if(!id) { throw new ApiError("Insira um 'id' valido.", 500) }
    
        try {
            await prisma.pessoa.delete({
                where: { id: id }
            });
        } catch(error: any) {
            if (error.code === 'P2025') { 
                throw new ApiError(`ID "${id}" não encontrado`, 422);
              }
              throw new ApiError(`Erro interno: ${error}`, 500);

            throw new ApiError(`${error}`, 500);
        }
    }

}

