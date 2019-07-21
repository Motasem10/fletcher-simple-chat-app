const validator=require('validator');
const isEmpty=require('./isEmpty');
import locale from '../locale';
module.exports=function(data){
  let errors={};

  data.email=isEmpty(data.email)?'':data.email;
  data.password=isEmpty(data.password)?'':data.password;

  if(!validator.isEmail(data.email))errors.email=locale.error["invalid-email"];

  if(validator.isEmpty(data.email)) errors.email=locale.error.emailRequired
  
 if(validator.isEmpty(data.password)) errors.password=locale.error.passwordRequired;
 if( !errors.password)  if(!validator.isLength(data.password,{min:8,max:150})) errors.password=locale.error["weak-password"];

return({
   errors,
   isvalid :isEmpty(errors)
})

}