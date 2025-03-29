import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../database/prisma';


import { ApiError } from '../controller/errorController';

const dataPath = path.join(__dirname, './../../data/pessoas.json');



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
    public readonly apelido: string // Unico
    public readonly nome: string;
    public readonly nascimento: string;
    public readonly stacks: Set<Stack>;



    constructor(apelido: string, nome: string, nascimento: string, stack: Set<Stack>) {
        //  Validação parametros não vazios
        if(!apelido || !nome || !nascimento){
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
        if (apelido.length > 30) {
            throw new ApiError("'apelido' deve ter menos de 30 caracteres.", 422 );
        }

        // Validação de apelido unico.
        if(Pessoas.findByApelido(apelido)){
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
        this.apelido = apelido;
        this.nome = nome;
        this.nascimento = nascimento;
        this.stacks = stack;

    }


    /*
        1. Carrega o arquivo string JSON.
        2. Converte os dados JSON em um array de Pessoa.
        3. Retorna o array de pessoas.
    */
    public static findAll(): Pessoas[] {
        try {
            const data = fs.readFileSync(dataPath, 'utf-8');
            const pessoas: Pessoas[] = JSON.parse(data);

            return pessoas;
        } catch (error) {
            throw new ApiError(`Erro ao tentar ler arquivo local de dados: ${error}`, 404 )
        }
    }

    /*
        1. Carrega um array de Pessoa utilizando o metodo findAll
        2. Filtra do array a Pessoa que tem o id igual aquele passado por parametro
        3. Caso encontrado retorna o objeto da Pessoa, caso não, retorna undefined.
    */
    public static findByid(id: string): Pessoas {
        const pessoas = Pessoas.findAll();
        const pessoa: Pessoas | undefined = pessoas.find(p => p.id === id);

        if (!pessoa) { throw new ApiError(`Pessoa com id '${id}' não encontrada.`, 404  ); }

        return pessoa;
    }

    /*
        1. Carrega um array de Pessoa utilizando o metodo findAll
        2. Filtra do array a Pessoa que tem o apelido igual aquele passado por parametro
        3. Caso encontrado retorna o objeto da Pessoa, caso não, retorna undefined.
    */
    public static findByApelido(apelido:string):Pessoas|undefined{
        const pessoas = Pessoas.findAll();
        const pessoa: Pessoas|undefined = pessoas.find(p => p.apelido === apelido);


        return pessoa;
    }

    public static searchPessoas(search: string): Pessoas[] {
        if (!search) { throw new ApiError("Parametro 't' não fornecido na query.", 500) }

        try {
            const pessoas: Pessoas[] = this.findAll();

            const result = pessoas.filter(pessoa =>
                pessoa.apelido.toLowerCase().includes(search.toLowerCase()) ||
                pessoa.nome.toLowerCase().includes(search.toLowerCase()) ||
                pessoa.nascimento.toLowerCase().includes(search.toLowerCase()) ||
                Array.from(pessoa.stacks).some(stack => stack.toLowerCase().includes(search.toLowerCase()))
            );

            return result;
        } catch (error) {
            throw new ApiError(`Erro ao tentar buscar pessoas: ${error}`, 201);
        }
    }


    public async save(): Promise<void>{
        try {

            await prisma.pessoa.create({
                data: {
                    username: this.apelido ,
                    nome: this.nome,
                    nascimento: this.nascimento,
                    stack: JSON.stringify(this.stacks)
                }
            })
        } catch (error) {
            if (error.code === 'P2002') { 
              throw new ApiError(`Apelido "${this.apelido}" já está em uso`, 422);
            }
            throw new ApiError(`Erro interno: ${error}`, 500);
          }
    }


    /*
        1. Encontra todas as pessoas no arquivo JSON.
        2. Filtra as pessoas para remover aquela com o ID especificado.
        3. Verifica se uma pessoa foi removida com sucesso.
        4. Atualiza/Reescreve o arquivo JSON.
    */
    public static removeById(id:string):void{
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

