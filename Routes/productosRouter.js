import express from "express";
import Controller from '../Controller/controller.js'
const productsRouter = express.Router();

productsRouter.get('/productos/:id?', async(req,res)=>{
  try{
   
    let controller = new Controller();
    if(req.session.user != null){
      if(req.session.user.isAdmin != 1){
        res.status(500).status({status:"500", message:"route inavilable"});
      }
    }  
    
    const {id} = req.params;    
    if(id == null || id <= 0){      
        let resultAll = await controller.ProductGetAll();
        res.send(resultAll);
    }else{
      let obj = {
        idCarrito: "0",
        idProduct: id
      }
      let result = await controller.ProductoFindById(obj);
      if(result.obj.idCarrito != "1" ){
        res.send({status:"200", message:"product found", obj: result});}
      else{
        res.send({status:"400", message:"not found product"});
      }
    }
  }catch(err){    
    res.send({status:"500", message:err});
  }
});
productsRouter.post('/producto', async(req,res)=>{
    try{
    if(req.body != {}){        
          let controller = new Controller();   
          const {idCarrito, idProduct, nameProduct, price, qty} = req.body;          
          //validations
          if(idCarrito == "1" || idProduct <= "0" || nameProduct.lenght == 0 || price == 0 || (qty <= 0 || qty == null)){
            let message = [];
              if(idCarrito == 1){
                message.push("idCarrito is not valid");
              }
              if(idProduct <=0){
                message.push("idProduct is not valid");
              }
              if(nameProduct.lenght == 0){
                message.push("nameProduct cannot be empty");
              }
              if(price <= 0){
                message.push("price cannot be free");
              }
              if(qty <= 0 || qty == null){
                message.push("qty must be positive value");
              }
             res.status(400).send({status: 400, message:message});
         }
         let object = {
             idCarrito: idCarrito == null?"0":idCarrito,
             idProduct: idProduct,
             nameProduct: nameProduct,
             price:price,
             qty:qty 
         }
         //check if exists         
         let result = await controller.ProductoFindById({idProduct:idProduct, idCarrito:idCarrito});
              
          if(result.obj.idCarrito != "1"){   
                            
              object.qty += result.obj.qty            
              //update
              let resultUpdate = await controller.ProductUpdate(object);
              if(resultUpdate.status !="200"){
                res.status(400).send(resultUpdate);                
              }else{
                res.status(200).send({status:"200", message:"product inserted"});
              }  
          }else{
            //insert                      
            await controller.CarritoInsertProd(object);
            res.status(200).send({status:"200", message:"product inserted"});
          }        
        
    }else{        
      res.status(400).send({status:"400", message:"object invalid"});
    }        
  }catch(err){
    res.status(404).send({status: "404", message: err});
  } 
 });

 productsRouter.delete('/producto/:id', async (req,res)=>{
    let controller = new Controller();
    try{
    if(req == null){
      res.status(500).send({status:"500", message:"the input cannot be empty"});
    }    
    if(req.session.user != null){
      if(req.session.user.isAdmin != "1"){        
        res.status(500).send({status: "500", message:"onli avilable for admin"});
      }
    }
    const {id} = req.params;
    if(id == null){
      res.status(400).send({status:"400", message:"the chart's id is invalid"});
    }
    let object = {
      idCarrito: 0,
      idProduct: id
    }
    let result = await controller.ProductDeleteById(object);
    if(result != null || result.obj.idCarrito == "1"){ 
      if(result.obj.idCarrito == 1){
        result.message = "product not found";
        result.status = "400";
      }     
      res.send({result});
    }else{
      res.status(404).send({status:"404", message:"cannot deleted"});
    }
  }catch(err){
    console.log(err);
    res.status(500).send({status:"500", message: err});
  }
 });
 productsRouter.put('/:id', async (req,res)=>{
  try{
    const {id}=req.params;
    const {nameProduct, qty, price} = req.body;
    const idProducto = id;
    if(id == null || id <= 0){
      res.status(400).send({status:"400", message:"invalid input"});
    }
    let controller = new Controller();
    let result = await controller.ProductoFindById({idProduct:idProducto, idCarrito:0});
    if(result.obj.idCarrito != "1"){  
      let object = {
        idProduct: (idProducto != null)?idProducto:result.obj.idProduct,
        qty: (qty != null && qty > 0)? qty : result.obj.qty, 
        nameProduct: (nameProduct != null)?nameProduct:result.obj.nameProduct,
        price : (price != null && price > 0)? price:result.obj.price       
      }              
        //update       
        let resultUpdate = await controller.ProductUpdate(object);        
        res.status(200).send(resultUpdate);
    }else{
      res.status(400).send({status:"400", message:"product not found"});
    }
  }catch(err){
    console.log(err);
    res.status(500).send({status:"500", message:"invalid operation"});
  }
 });

 export default productsRouter;