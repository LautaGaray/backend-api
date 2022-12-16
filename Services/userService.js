import genericRepository from './genericRepository.js';
import User from '../Models/userModel.js'

export default class UserService extends genericRepository{
    constructor (dao){
        super(dao, User.collection)
    }
}