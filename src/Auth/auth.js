import React from 'react';
import Loading from '../components/loading';
import firebase from 'firebase';
import { config } from '../config';
import swal from 'sweetalert';

firebase.initializeApp(config);
export const auth = firebase.auth();
export const db = firebase.firestore();
export const realtimeDb = firebase.database;
export const storageRef = firebase.storage();



// user Sign Up  
export const Register = (e, that) => {
    e.preventDefault();
    var email = document.querySelector(".signUp-email");
    var pass = document.querySelector(".signUp-pass");
    var name = document.querySelector('.profile-name');

    if ((email.value.length && pass.value.length && name.value.length) !== 0) {
        auth.createUserWithEmailAndPassword(email.value, pass.value)
            .then(async (user) => {
                swal('success', `Your Account Has Been Created Successfully !!`, { icon: 'success' });
                user.user.updateProfile({
                    displayName: name.value
                })
                await db.collection('userList').add({
                    name: name.value,
                    email: email.value
                }).then(res => {
                    console.log(res, 'added');

                })
                return window.location.href = 'localhost:3000/';
            })
            .catch(err => {
                swal('error', `${err.message}`, { icon: 'warning' })
            })

    } else {
        swal('error', 'empty field', { icon: 'info' });
    }

}



// USer Sign Out
export const SignOut = (e) => {
    e.preventDefault();
    auth.signOut().then(res => {
        swal('Info', 'You\'re Logged Out Successfully', { icon: 'success' });
    }).catch(err => {
        swal('error', `${err.message}`, { icon: "error" })
    });
}



// User login 
export const login = (e) => {
    e.preventDefault();
    const email = document.getElementById("signIn-email").value;
    const pass = document.getElementById("signIn-pass").value;

    auth.signInWithEmailAndPassword(email, pass).then(res => {
        swal('success', 'Logged In Successfully', { icon: "success" });
    }).catch(err => {
        swal('error', `${err.message}`, { icon: 'warning' })
    });
}



// Reset Email
export const Reset = (e, that) => {
    e.preventDefault();
    const email = document.querySelector('#forgot-email');

    auth.sendPasswordResetEmail(email.value).then(res => {
        swal('success', 'Email has been sent !!', { icon: 'success' });
        window.location.href = 'localhost:3000/'
    }).catch(err => {
        swal('warning', `${err.message}`, { icon: 'warning' });
    })

}