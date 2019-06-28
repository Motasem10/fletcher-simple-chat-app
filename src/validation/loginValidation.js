const validator=require('validator');
const isEmpty=require('./isEmpty');

module.exports=function(data){
  let errors={};

  data.email=isEmpty(data.email)?'':data.email;
  data.password=isEmpty(data.password)?'':data.password;

  if(!validator.isEmail(data.email))errors.email='email is valid ';

  if(validator.isEmpty(data.email)) errors.email='email is required'
  
  if(validator.isEmpty(data.password)) errors.password='password is required'
  if(!validator.isLength(data.password,{min:8,max:150})) errors.password='password is too short';
return({
   errors,
   isvalid :isEmpty(errors)
})

}