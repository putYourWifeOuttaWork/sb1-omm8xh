importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyARAwqPtLidvBiNWJ6SBm4d-qR3KNtCacQ",
  authDomain: "deflationproof.firebaseapp.com",
  projectId: "deflationproof",
  storageBucket: "deflationproof.firebasestorage.app",
  messagingSenderId: "916854852623",
  appId: "1:916854852623:web:a68fd1d16a0b1aa174a77a",
  measurementId: "G-0307BX3BGK"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});