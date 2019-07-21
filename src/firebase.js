//import * as firebase from 'firebase';
//if(!firebase.apps.length){
//     var config = {
//       apiKey: "AIzaSyAE4zm_Ra_6gajcMZ9Kl6T-GaZDlT2ZwGo",
//       authDomain: "control-717c0.firebaseapp.com",
//       databaseURL: "https://control-717c0.firebaseio.com",
//       projectId: "control-717c0",
//       storageBucket: "control-717c0.ci4w0.appspot.com",
//       messagingSenderId: "335441848101"
//     };

//    firebase.initializeApp(config);

//   }
import firebase from 'react-native-firebase';





//a=firebase.firestore().settings({cacheSizeBytes:firebase.firestore.CACHE_SIZE_UNLIMITED})


// firebase.firestore().enablePersistence().catch(err => {
//   console.log({ errFirestore: err });
//   if (err.code === 'faild-precondition') {

//   }

// })


// // firebase.firestore().collection('users').doc('aly').set({a:true}).then((a)=>{

// //    console.log('locaaaaaaaaaaaaaaaaaaaaaaaaal fb',{a:a})
// //  }).catch(err=>{
// //    console.log('firestooooooooore',{err});
// //  })


export default firebase;

/*

 database = {
   users: {
     id: {
       name,
       email,
       phone,
       image,

     }
   },
   chat: {
     myid: {
       senderId1: {
         massegeId: {
           msg,
           time,
           mine,

         }
       },
       senderId2: {
         massegeId: {
           msg,
           time,
           mine,

        }
      }
    }
  },
  friends: {
    myid: {
      friendId1: {
        lastMsg,
        time,
        image,
        name
      },
      friendId2: {
        lastMsg,
        time,
        image,
        name
      },

    }

  }


}
*/
//data base local

// DB_LOCAL={
// friends:{
//   id:{
//     lastMsg,
//     time,
//     image,
//     name
//   },
//   chat:{
//     id:{
//       mine,
//       msg,
//       time
//     }
//   }
// }
// }


//ASYNC STORG
// mgs =
// [{MSG,numberofMsg=10},{MSG},{MSG}];

// id={
//   firstMsg:'dspdsdmfdfmdfdmkfdm',
//   numberOfDoc:'10',

// }
// //first doc 
// id+numberOfDoc


