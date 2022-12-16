import express from "express";
import Controller from '../Controller/controller.js'
import session from "express-session";

const loginRouter = express.Router();

loginRouter.post('/sessions/login', async (req,res)=>{
    const {name, email, password} = req.body;    
    let isCorrect = true; 
    let messages = []
    try{
        
        if(name == null || name == ""){
            messages.push("The name cannot be empty");
            isCorrect = false; 
        }
        if(email == null || email == ""){
            messages.push("The email cannot be empty");
            isCorrect = false; 
        }
        if(password == null || password == ""){
            messages.push("The pasword cannot be empty");
            isCorrect = false; 
        }
        if(isCorrect == false){
            
            res.status(400).send({status:"400", message: messages});
        }
        let controller = new Controller();
        let obj = {
            name: name,
            email:email,
            password:password
        }
        let result = await controller.UserGet(obj);
        if(result == null){  
            
            res.status(400).send({status:"400", messages:"Not found user"});
        }
        req.session.user = {
            name: name,
            email:email,
            isAdmin:result.isAdmin
        }        
        console.log(req.session.user);
        if(result.isAdmin == 1){  
              
            res.status(200).send({status:"200", messages:"You're user is Admin"});
        }else{
             
            res.status(200).send({status:"200", messages:"You're user is OK"});
        }          

    }catch(err){
       
        res.status(500).send({status:500, messages:err});
    }    
});

export default loginRouter;