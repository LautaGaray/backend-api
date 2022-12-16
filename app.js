import express from 'express';
import { hasUncaughtExceptionCaptureCallback } from 'process';
import {fileURLToPath} from 'url';
import chartRouter from './Routes/carritoRouter.js'
import productsRouter from './Routes/productosRouter.js';
import loginRouter from './Routes/loginRouter.js'
import session from 'express-session';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

const app = express();
const PORT = process.env.PORT || 3030;
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.resolve('./');


const options = {
    definition: {
        openapi:'3.0.0',
        info:{
            title:'Proyecto Final Backend-Coderhouse',
            description:'API de ecommerce'
        }    
   },
   apis:[`${_dirname}/docs/*.yaml`]
} 
const server = app.listen(PORT, ()=>{
    console.log('server initializated' + _dirname);    
});
const specs = swaggerJSDoc(options);
app.use('/api-docs', swaggerUiExpress.serve,swaggerUiExpress.setup(specs));
app.use(express.json());
app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.use(express.static(_dirname+'/public'));
app.set('views', _dirname+'/public');
app.use(session({
    secret:"coderFinalProyect",    
    resave:false,
    saveUninitialized:false
}));

process.on('uncaughtException', (err) =>{
    return {status: 400, message: err};
});
app.get('/index', (req, res)=>{  
    res.render('index');     
  });

app.use('/api/', loginRouter);
app.use('/api/', chartRouter);
app.use('/api', productsRouter);

//testing
let carrito = {
    idCarrito:"1",  
    idProduct: "3",
    nameProduct: "producto de test 2",
    price: "HOLA",
    qty: 200       
}
   

