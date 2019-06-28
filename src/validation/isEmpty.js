module.exports=function (data){
    return (typeof data=='object'&&Object.keys(data).length==0 )||
       (typeof data==='string' && data.length===0)||
       (data ==null)||
       (data==undefined);
         
   
   
   }