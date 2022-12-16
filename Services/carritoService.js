
import genericRepository from './genericRepository.js';
import Carrito from '../Models/carritoModel.js'

export default class carritoService extends genericRepository{
    constructor (dao){
        super(dao, Carrito.collection)
    }
}