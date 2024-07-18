import { Router } from "express";
import { createPessoa, getPessoaById, getPessoas, removePessoaById, searchPessoa } from "../controller/pessoasController";

const router = Router();

/**
 * @route GET /pessoas
 * @description Search for pessoas based on query parameters
 */
router.get("/", searchPessoa);

/**
 * @route GET /pessoas/:id
 * @description Get a pessoa by its ID
 */
router.get("/:id", getPessoaById);

/**
 * @route DELETE /pessoas/:id
 * @description Remove a pessoa by its ID
 */
router.delete("/:id", removePessoaById);

/**
 * @route POST /pessoas
 * @description Create a new pessoa
 */
router.post("/", createPessoa);

/**
 * @route GET /pessoas
 * @description Get all pessoas
 */

// Descomente a linha abaixo se quiser ter uma rota para obter todas as pessoas
// router.get("/", getPessoas);

export default router;
