

export default class User{
    static get collection(){
        return 'User';
    }
    static get schema(){
        return{            
           name:String,
           email:String,
           password:String,
           isAdmin:Number        
        }
    }
}