
import Product from "../Models/productoModel.js";
export default class Cart{
    static get collection(){
        return 'Carrito';
    }
    static get schema(){
        return{            
            idCarrito:String,
            idProduct:String,
            nameProduct:String,
            price:Number,
            qty:Number             
        }
    }
}