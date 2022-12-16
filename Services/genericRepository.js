export default class GenericRepository{
    constructor(dao, model){
        this.dao = dao;
        this.model = model; 

    }
    getAll = async(params)=>{
        return this.dao.getAll(params, this.model);
    }
    findOne = async(params)=>{
        return this.dao.findOne(params, this.model);
    }
    delete = async(params)=>{
        return this.dao.delete(params, this.model);
    }
    postOne = async(params)=>{
        return this.dao.postOne(params, this.model);
    }
    insertOnes = async(params)=>{
        return this.dao.insertOnes(params, this.model);
    }
    updateOne = async(params)=>{
        return this.dao.update(params, this.model);
    }
    getKey = async()=>{
        return this.dao.getKey();
    }
}