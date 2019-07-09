import * as firebase from 'firebase';
if(!firebase.apps.length){
    var config = {
      apiKey: "AIzaSyAE4zm_Ra_6gajcMZ9Kl6T-GaZDlT2ZwGo",
      authDomain: "control-717c0.firebaseapp.com",
      databaseURL: "https://control-717c0.firebaseio.com",
      projectId: "control-717c0",
      storageBucket: "control-717c0.ci4w0.appspot.com",
      messagingSenderId: "335441848101"
    };
  
   firebase.initializeApp(config);

  }
  export default firebase;