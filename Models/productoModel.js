export default class Product{
    static get collection(){
        return 'Producto';
    }
    static get schema(){
        return{    
            idProduct:String,
            nameProduct:String,
            price:Number,
            qty:Number                          
        }           
        
    }
}