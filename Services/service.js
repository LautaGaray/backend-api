import DAO from '../Models/DAO.js'
import carritoService from './carritoService.js'
import productService from './productoService.js'
import UserService from './userService.js'


const dao = new DAO();
export const  chartService = new carritoService(dao);
export const productServices = new productService(dao);
export const userService = new UserService(dao);

