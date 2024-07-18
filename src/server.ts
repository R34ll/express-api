import express from "express"
import { Router, Request, Response } from "express";
import pessoasRouter from "./routes/pessoasRouter";



const app = express();
const router = Router();
const PORT = process.env.EXPRESS_PORT || 3000;

app.use(router)
app.use(pessoasRouter)

router.get("/ping",(request: Request, response: Response) =>{
    response.json({
        message:"pong"
    }).status(202);
})

// Endpoint especial
router.get("/contagem-pessoas", countPessoas);



app.listen(PORT, () =>
    console.log(`Servidor aberto na porta ${PORT}`)
)
