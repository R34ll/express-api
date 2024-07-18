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
    public readonly apelido: string // Unico
    public readonly nome: string;
    public readonly nascimento: string;
    public readonly stacks: Set<Stack>;

    constructor(apelido: string, nome: string, nascimento: string, stack: Set<Stack>) {
        if(!apelido || !nome || !nascimento){
            throw new ApiError("Preencha todos os campos.",500);
        }

        if (stack.size > Object.keys(Stack).length) {
            throw new ApiError(`Tamanho de stacks '${stack.size}' invalido.`, 500);
        }

        for (const item of stack) {
            if (!Object.values(Stack).includes(item.toLowerCase() as Stack)) {
                throw new ApiError(`Valor de '${item}' invalido.`, 500);
            }
        }

        if (apelido.length > 30) {
            throw new ApiError("'apelido' deve ter menos de 30 caracteres.", 500);
        }

        if(Pessoas.findByApelido(apelido)){
            throw new ApiError("'apelido' já usado por outra pessoa.",500);
        }

        if (nome.length > 100) {
            throw new ApiError("'nome' deve ter menos de 30 caracteres.", 500);
        }

        if (!(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(nascimento))) {
            throw new ApiError("Formato da data de nascimento errada. Siga o formato YYYY-MM-DD", 500);
        }



        this.id = this.generateId(); // Gera, por incremento automático(ordem crescente), o ID 
        this.apelido = apelido;
        this.nome = nome;
        this.nascimento = nascimento;
        this.stacks = stack;

    }

    // Garante ID unico e auto incrementado
    private generateId(): number {
        const pessoas = Pessoas.findAll();
        return pessoas[pessoas.length - 1].id + 1;
    }

    public static findAll(): Pessoas[] {
        try {
            const data = fs.readFileSync(dataPath, 'utf-8');
            const pessoas: Pessoas[] = JSON.parse(data);

            return pessoas;
        } catch (error) {
            throw new ApiError(`Erro ao tentar ler arquivo local de dados: ${error}`, 500)
        }
    }

    public static findByid(id: number): Pessoas {
        const pessoas = Pessoas.findAll();
        const pessoa: Pessoas | undefined = pessoas.find(p => p.id === id);

        if (!pessoa) { throw new ApiError(`Pessoa com id '${id}' não encontrada.`, 404); }

        return pessoa;
    }

    public static findByApelido(apelido:string):Pessoas|undefined{
        const pessoas = Pessoas.findAll();
        const pessoa: Pessoas|undefined = pessoas.find(p => p.apelido === apelido);


        return pessoa;
    }

    public save(): void{
        try {
            const data = fs.readFileSync(dataPath, 'utf-8');
            const pessoas: Pessoas[] = JSON.parse(data);
            
            pessoas.push(this);
            const newData = JSON.stringify(pessoas, null, 2);

            fs.writeFileSync(dataPath, newData, 'utf-8');

        } catch (error) {
            throw new ApiError(`Erro ao tentar salvar nova pessoa: ${error}.`, 500);
        }
    }


    public static removeById(id:number):void{
        if(!id){throw new ApiError("Insira um 'id' valido.",500)}


        try{
            const pessoas = Pessoas.findAll();
            const filteredPessoas = pessoas.filter(p => p.id !== id);

            if (pessoas.length === filteredPessoas.length) {
                throw new ApiError(`Pessoa com id '${id}' não foi encontrada.`, 400);
            }

            fs.writeFileSync(dataPath, JSON.stringify(filteredPessoas, null, 2), 'utf-8');

        }catch(error){
            throw new ApiError(`${error}`, 500);
        }
    }

}

