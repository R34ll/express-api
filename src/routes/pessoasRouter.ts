import { Router } from "express";
import { createPessoa, getPessoaById, getPessoas, removePessoaById, searchPessoa } from "../controller/pessoasController";

const router = Router()


// /pessoas
//  router.get("/",getPessoas)

router.get("/",searchPessoa)


// /pessoas/123
router.get("/:id", getPessoaById)

// /pessoas/123 
router.delete("/:id",removePessoaById)

// /pessoas
router.post("/", createPessoa)



export default router


