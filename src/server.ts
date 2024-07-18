import express, { NextFunction } from "express"
import { Router, Request, Response } from "express";
import pessoasRouter from "./routes/pessoasRouter";
import { countPessoas } from "./controller/pessoasController";
import { ApiError } from "./controller/errorController";


const app = express();
const router = Router();
const PORT = process.env.EXPRESS_PORT || 3000;

app.use(router)
app.use("/pessoas", pessoasRouter)


// Middleware
app.use((error: Error & Partial<ApiError>, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.statusCode ?? 500
    const message = error.statusCode ? error.message : "Internal Server Error"
    
    return res.status(statusCode).json({ 
        "API Error": { 
            "status": statusCode, 
            "message": message 
        } 
    })
})

router.get("/ping",(request: Request, response: Response) =>{
    response.json({
        message:"pong"
    }).status(202);
})

// Endpoint especial
router.get("/contagem-pessoas", countPessoas);

app.get('*', function(req, res){
    res.status(404).send('<div><marquee direction="left" scrollamount="20" ><h1>Página não encontrada!</h1></marquee></div>');

});


app.listen(PORT, () =>
    console.log(`Servidor aberto na porta ${PORT}`)
)
