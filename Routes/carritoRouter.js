import express from "express";
import Controller from '../Controller/controller.js'
const chartRouter = express.Router();


chartRouter.get('/carrito/:id/productos', async (req, res)=>{
    try{
        let controller = new Controller();       
        const {id} = req.params;              
        if(id == null || id == 0)
        {
            res.status(400).send({status: 400, message:"you must set the chart's id and must be valid"});
        }
        let allResult = await controller.CarritoGetAll({idCarrito: id}); 
        //get chart and set the response      
        if(allResult.obj.idCarrito == "1" || allResult == null){
           res.status(400).send({status: 404, message:"chart doesn`t have products"});
        }else{
          res.send(allResult);
        }          
    }
    catch(err){        
        res.status.send({status: 400, message: err});
    }    
});
chartRouter.post('/carrito', async (req,res)=>{
    {
        try{
            let controller = new Controller();
            //get automatical key and save de chart
            let result = await controller.CarritoGetKey();            
            if(result != null && result.obj != null){
                let object = {
                    idCarrito : result.obj
                }
                await controller.CarritoCreate(object);
                res.status(200).send({status:"200", message:"correct", obj: object});
            }else{
                res.status(400).send({status:"400", message:"cannot set"});
            }            
        }catch(err){
            res.status(500).send({status:"500", message:"cannot continue the operation"});
        }
    }
})
chartRouter.delete('/carrito/:id', async (req,res)=>{
    try{
        let id = req.params;       
        if(req.session.user != null){
            if(req.session.user.isAdmin != "1"){
                res.status(400).send({status: 400, message:"route not avilable"});
            }
        }
        if(id == null || id.id <= 1){
            res.status(400).send({status: 400, message:"the input is invalid"});
        }else{
            let controller = new Controller();
            let object = {
                idCarrito: id.id
            }; 
            //check and delte chart
            let exists = await controller.CarritoCheckExist(object);
            if(exists.status == "400"){
                res.send(exists);
            }else{                    
               let result = await controller.CarritoDelete(object);
               console.log(result);
               res.status(200).send({status: "200", message: "the chart has been deleted"});
            }                     
        }
    }catch(err){       
        res.status(500).send({status: "500", message:err});
    }
});
chartRouter.delete('/carrito/:id/productos/:id_prod', async (req,res)=>{
    try{
        let controller = new Controller();
        const {id, id_prod} = req.params;
        console.log(id);
        if(req.session.user != null){
            if(req.session.user.isAdmin != "1"){             
              res.status(500).send({status: "500", message:"only avilable for admin"});
            }
          }
        if(id == null || id == "1"){
           res.status(400).send({status: "400", message:"invalid idCarrito input"});
        }
        if(id_prod == null){
           res.status(400).send({status: "400", message:"invalid idCarrito input"});
        }
       let object = {
        idCarrito: id,
        idProduct: id_prod
       }     
       //check if exists and if its then deleted
       let result = await controller.ProductDeleteById(object);           
       res.send(result);
    }catch(err){        
        res.status(500).send({status: "500", message:"unexpected error"});
    }   
});
chartRouter.post('/carrito/:id/producto' , async(req,res)=>{
    try{
        const {id} = req.params;
        const {idCarrito} = req.body
        
        if(id == null){
           res.status(400).send({status:"400", message:"invalid input"});
        }
        let idCarritos = "2";
        if(req.session.user != null){
            if(req.session.user.idCarrito != null){
                idCarritos = req.session.idCarrito;
            }           
        }
        let object = {
            idProduct: id,
            idCarrito: 0
        }
        let controller = new Controller();
        //find product without chart
        let result = await controller.ProductoFindById(object);           
        if(result == null || result.obj.idCarrito == "1"){
            res.status(400).send({status:"400", message:"product not found"});
        }else{
            result.obj.idCarrito = idCarrito == null? idCarritos:idCarrito;
            let resultPost = await controller.CarritoInsertProd(result.obj);
            res.send(resultPost);
        }
    }catch(err){        
        res.status(500).send({status:"500", message:err});
    }    
});
export default chartRouter;