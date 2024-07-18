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
        
        this.id = 0; // Gera, por incremento automático(ordem crescente), o ID 
        this.apelido = apelido; 
        this.nome = nome;
        this.nascimento = nascimento;
        this.stacks = stack;

    }



}