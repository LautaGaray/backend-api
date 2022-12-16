import carritoService from '../Services/carritoService.js';
import {chartService, productServices, userService} from '../Services/service.js'
import carritoModel from '../Models/carritoModel.js'



export default class Controller{
    constructor(){
        this.empty = this.messageForEmpty;
        this.error = this.messageForError;
        this.succes = this.messageForSucces;
    }
    CarritoGetKey = async()=>{
        try{
            let result = await chartService.getKey();
            if(result != null){                
                this.messageForSucces.obj = result;
                return this.messageForSucces
            }else{
                 this.messageForSucces.obj = "2";
                 return this.messageForSucces;
            }
        }catch(err){
            this.messageForError.message = err;
            return this.messageForError;
        }
    }
    CarritoCreate = async(options)=>{
        if(options.idCarrito == null){
            return this.messageForError;
        }
        let object = {
            idCarrito: options.idCarrito,
            idProduct: 0,
            nameProduct: "",
            qty: 0,
            price: 0
        }
        chartService.postOne(object);
        return this.messageForSucces;
    }
    CarritoGetAll = async(options)=>{        
        try{          
            let allProducts = await chartService.getAll(options);             
            if(allProducts.length == 0){                
                this.messageForError.message = "the chart doesn`t exists";
                let objects = {
                    idCarrito: "1"
                }
                this.messageForError.obj = objects
                return this.messageForError;
             }                     
             if(allProducts != null || allProducts.length > 0){                
                let idCarritos = "1";
                  
                if(allProducts[0].idCarrito != null){
                    idCarritos = allProducts[0].idCarrito;
                }
                let object =  {
                    idCarrito: idCarritos,
                    products: []
                }
                for (let i = 0; i < allProducts.length; i++) {
                       let carritoCompleto = allProducts[i];                   
                        let newElement = {                           
                        idProduct:carritoCompleto.idProduct,
                        nameProduct:carritoCompleto.nameProduct,
                        price:carritoCompleto.price,
                        qty:carritoCompleto.qty  
                        }        
                              
                   object.products.push(newElement);                            
                }               
                this.messageForSucces.obj = object;
                return  this.messageForSucces; 
            } 
            
            return this.messageForError  
           
        }catch(err){           
            this.messageForError.message = "Error: "+err;          
            return this.messageForError;
        }    
    }
    ProductoFindById = async(obj)=>{
        try{
            
            if(obj.idProduct == null ){
                return {idCarrito: "1"};
            }
            
            let idFilter = {
                idProduct: obj.idProduct,
                
            }
            if(obj.idCarrito != null){
                idFilter = {
                    idProduct: obj.idProduct,
                    idCarrito : obj.idCarrito
                }
            }
            let objectResult  = {idCarrito: "1"};
            let result = await productServices.findOne(idFilter);             
            if(result != null){                
                objectResult = {
                idCarrito: result.idCarrito,
                idProduct: result.idProduct, 
                nameProduct: result.nameProduct,
                price: result.price,
                qty: isNaN(result.qty)?0:result.qty
                }
            }           
            this.messageForSucces.obj = objectResult;
            return this.messageForSucces;

        }catch(err){
            this.messageForError.obj = {idCarrito: "1"};
            this.messageForError.message = err; 
         
            return this.messageForError;
        }

    }
    ProductDeleteById = async(obj)=>{
        try{
            let idFind = {idProduct: obj.idProduct, idCarrito: obj.idCarrito};    
            
            let result = await this.ProductoFindById(idFind);           
            if(result != null && result.obj.idCarrito != "1"){                
                let result = await chartService.delete(idFind);                
                return this.messageForSucces;
            }else{
                this.messageForError ="product doesn't exist";
                return this.messageForError
            }
        }catch(err){
            this.messageForError.message = err;
            return this.messageForError; 
        }
    }
    ProductGetAll = async()=>{
        try{
            let object = {
                idCarrito: "0"
            }
            let result = await productServices.getAll(object);            
            if(result != null){
                this.messageForSucces.obj = result;
                return this.messageForSucces;
            }else{
                return this.messageForError;
            }
        }catch(err){            
            return this.messageForError;
        }
    }
    ProductUpdate = async(obj)=>{
        try{            
            let id = obj.idProducto;
            let options = {
               vals: {idProducto: id},
               pars: {
                    qty: obj.qty,
                    price: obj.price,
                    nameProduct: obj.nameProduct
                }
            }        
            let result =  await productServices.updateOne(options);
            this.messageForSucces.obj = obj;            
            return this.messageForSucces;
        }catch(err){
            this.messageForError.message = err;
            return this.messageForError;
        }
    }
    CarritoGetProductByFilter = async(obj)=>{
        try{          
           if(obj == null || obj.lenght == 0){
            return this.messageForEmpty;
            }
           let product = await chartService.findOne(obj);
           if(product == null || product.lenght == 0){
              return this.error;
            }
            this.succes.object = product;
            return this.succes;
        }catch(err){
            this.error.message += ". Error: "+ err;
            return this.err;
        }    
    }  
    CarritoCheckExist = async(obj)=>{
        try{
            let result = await chartService.getAll(obj);
            if(result.length == 0){
                this.messageForError.message = "Chart doesn't exist";
                return this.messageForError;
            }else{
                return this.messageForSucces
            }

        }catch(err){
            return this.messageForError;
        }
    }
    CarritoDelete = async(obj)=>{
        try{
             if(obj == null || obj.lenght == 0){
             return this.messageForEmpty;
             }
            
             let chart = await chartService.delete(obj);            
             this.messageForSucces.obj = chart;   
             this.messageForSucces ="Chart Deleted";                               
             return this.messageForSucces;
        }catch(err){          
            
             this.messageForError.message = ". Error: "+ err;
             return this.messageForError;
        }    
    }
    CarritoInsertProd = async(obj)=>{
        
        try{       
            if(obj == null || obj.lenght == 0){              
             return this.messageForEmpty;             
            }          
           let result = await chartService.postOne(obj);           
           this.messageForSucces.message ="Product inserted with id: "+ obj.idProduct;
           return this.messageForSucces;      
        }catch(err){            
            this.messageForError.message = "Error: "+err;            
            return this.messageForError;
        }   
    }  
    
    CarritoGetID = async() =>{
         let result = await chartService.getKey();
         return {chartId: result};
    }
    UserGet = async(obj)=>{
        let result = await userService.findOne(obj);
        return result; 
    }

   messageForEmpty = {status: 404, message: "the input values cannot be empty"};
   messageForError = {status: 400, message: "cannot found the product"};
   messageForSucces = {status: 200, message: "OK"}

}

