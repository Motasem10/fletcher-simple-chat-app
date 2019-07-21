import {NativeModules,I18nManager} from 'react-native'
import  en from  './en.json';
import ar from './ar.json';
//import ar from './ar.json';

const  local = NativeModules.I18nManager.localeIdentifier.slice(0,2);
switch(local){
    case 'ar':
    language= ar;
        break;
default :
 language=  en;
  
}
export default language;

  //I18nManager.isRTL();




