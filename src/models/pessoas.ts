import fs from 'fs';
import path from 'path';
import { ApiError } from '../controller/errorController';

const dataPath = path.join(__dirname, './../../data/pessoas.json');


enum Stack {
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
    private id: number // Unico
    public readonly apelido:string // Unico
    public readonly nome: string;
    public readonly nascimento: string;
    public readonly stacks: Set<Stack>;

    constructor(apelido: string, nome: string, nascimento:string, stack: Set<Stack>){ 
        
        this.id = this.generateId(); // Gera, por incremento automático(ordem crescente), o ID 
        this.apelido = apelido; 
        this.nome = nome;
        this.nascimento = nascimento;
        this.stacks = stack;

    }

    // Garante ID unico e auto incrementado
    private generateId(): number{
        const pessoas = Pessoas.findAll();
        return pessoas[pessoas.length-1].id + 1;
    }

    public static findAll():Pessoas[]{
        try {
            const data = fs.readFileSync(dataPath, 'utf-8');
            const pessoas: Pessoas[] = JSON.parse(data);
    
            return pessoas;
        } catch (error) {
            throw new ApiError(`Erro ao tentar ler arquivo local de dados.: ${error}`,500)
        }
    }

}

