import { Router } from "express";

const router = Router()


// /pessoas
 router.get("/",getPessoas)

// /pessoas/123
router.get("/:id", getPessoaById)

// /pessoas/123
router.delete("/:id",removePessoaById)

// /pessoas
router.post("/", createPessoa)



export default router


