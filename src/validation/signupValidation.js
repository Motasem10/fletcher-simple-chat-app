const validator=require('validator');
const isEmpty=require('./isEmpty');
import locale from '../locale/index';

module.exports=function(data){
  let errors={};
  data.name=isEmpty(data.name)?'':data.name;
  data.email=isEmpty(data.email)?'':data.email;
  data.password=isEmpty(data.password)?'':data.password;
  data.password2=isEmpty(data.password2)?'':data.password2;
  data.image=isEmpty(data.image)?'':data.image;
      

  if(!validator.isEmail(data.email))errors.email=locale.error["invalid-email"];
  //confirm password
if(!validator.equals(data.password,data.password2))
errors.password2='it is not asame'
if(!validator.isLength(data.image,{min:15,max:300})) errors.name=locale.error.photo;
  if(!validator.isLength(data.name,{min:3,max:30})) errors.name=locale.error.nameLength;
  if(!validator.isLength(data.password,{min:8,max:150})) errors.password=locale.error["weak-password"];
  if(validator.isEmpty(data.email)) errors.email=locale.error.emailRequired;
  
  if(validator.isEmpty(data.password)) errors.password=locale.error.passwordRequired
  
  if(validator.isEmpty(data.password2)) errors.password2=locale.error.password2
return({
   errors,
   isvalid :isEmpty(errors)
})

}