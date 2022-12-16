import mongoose from 'mongoose'
import config from '../Config/confij.js'
import User from './userModel.js'
import Carrito from './carritoModel.js'
import AutomaticKey from './automaticKey.js';



export default class Dao{
    constructor() {
        let configurations = new config();
        this.mongoose = mongoose.connect(configurations.URL);
        const timestapms = {timestamps:{createdAt:'created_at', updatedAt:'updatedAt'}}
        //const userSchema = mongoose.Schema(User.schema,timestapms);
        this.models = {
            [Carrito.collection]:mongoose.model(Carrito.collection, Carrito.schema),
            [AutomaticKey.collection]:mongoose.model(AutomaticKey.collection, AutomaticKey.schema),
            [User.collection]:mongoose.model(User.collection, User.schema)
        }
    }

    getAll = async (options, entity) =>{        
        
        if(!this.models[entity]){
           
            throw new Error('La entidad no existe');
        }
        let result = await this.models[entity].find(options).lean();
        
        return result; 
         
    }
    findOne = async(options, entity)=>{
        if(!this.models[entity]){
            throw new Error('La entidad no existe');
        }
        let result = await this.models[entity].findOne(options).lean(true);
        
        return result;
    }
    postOne = async(options, entity)=>{
            
        if(!this.models[entity]){
            throw new Error('La entidad no existe');            
        }                  
        let result = await this.models[entity].create(options).lean;

       
        return result;
        
    }
    insertOnes = async(options, entity)=>{
            
        if(!this.models[entity]){
            throw new Error('La entidad no existe');            
        }                  
        let result = await this.models[entity].insertMany(options).lean;

       
        return result;
        
    }
    delete = async(options, entity)=>{
        if(!this.models[entity]){
            throw new Error('La entidad no existe');
        }
        let result = await this.models[entity].deleteMany(options).lean();

    }
    update = async(options, entity)=>{
        if(!this.models[entity]){
            throw new Error('La entidad no existe');
        }
        await this.models[entity].updateOne(options.vals, {$set :options.pars}).lean();
    }
    getKey = async()=>{
        let key = await this.models["AutomaticKey"].findOne().lean();
        let result = 1; 
        if(key.Key > 0){
            result = key.Key;            
            let newKey = result+1;
            await this.models["AutomaticKey"].updateOne({Key: result}, {$set: {Key: newKey}});
            return result;

        }else{
            return result; 
        }

    }
    

    

}
