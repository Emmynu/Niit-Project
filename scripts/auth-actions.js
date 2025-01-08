import { auth, db } from "./firebase-config.js";
import {  createUserWithEmailAndPassword , updateProfile, sendEmailVerification,signInWithEmailAndPassword,sendPasswordResetEmail }  from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { push, ref, child, get } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import { errorStyles, sucessStyles } from "./toastify.js";


export const nameRegex = new RegExp(/^[a-zA-Z]*$/)
export const emailRegex = new RegExp( /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
export const passwordRegex = new RegExp(/^[0-9]{6,6}$/)


export async function createUser(email, password, name) {
    try {
       const { user } =  await createUserWithEmailAndPassword(auth, email, password)
       await updateProfile(user,{
        displayName: name,
        photoURL: "https://images.pexels.com/photos/884788/pexels-photo-884788.jpeg?auto=compress&cs=tinysrgb&w=600"
       })   
       await saveUserToDb(user)
       localStorage.setItem("token", JSON.stringify(user?.accessToken)) //save the token to local storage
       // send email verification link
       await sendEmailVerification(user)
        Toastify({
            text: "Email verification link sent",
            duration: 2000,
            style:sucessStyles,
         }).showToast()
       
    } catch (error) {
        Toastify({
            text: error?.message,
            duration: 2000,
            style:errorStyles,
         }).showToast()
    }
}

export async function saveUserToDb(user) {
try {
    const {uid, email, photoURL,displayName} = user
    await push(ref(db, `users/`),{
    name:displayName,
    email, 
    url:photoURL,
    id:uid
    })
} catch (error) {
    Toastify({
        text: error?.message,
        duration: 2000,
        style:errorStyles,
     }).showToast()
    
}
}


export async function loginUser(email, password) {
    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password)
        localStorage.setItem("token", JSON.stringify(user?.accessToken)) // new token for new session
        if (!user?.emailVerified) {
            Toastify({
                text: "Verify your account ",
                duration: 2000,
                style:sucessStyles,
             }).showToast()
            
        } else {
            Toastify({
                text: "Successfully logged in ",
                duration: 2000,
                style:sucessStyles,
             }).showToast()

           setTimeout(() => {
             window.location = "/"
           }, 2000);
        }
    } catch (error) {
         Toastify({
                text: error?.message,
                duration: 2000,
                style:errorStyles,
             }).showToast()
             
    }
    
    
}

export async function getUserInDb() {
   try {
    const dbRef = ref(db)
    const user =  get(child(dbRef, `users/`)).then(res=> res.exists()? Object.entries(res.val()) : [])
    return user
   } catch (error) {
    Toastify({
        text: error?.message,
        duration: 2000,
        style:errorStyles,
     }).showToast()
   }
}

export async function sendResetPasswordLink(email) {
   try {
    const user =  await getUserInDb(auth?.currentUser?.uid)
    if (user?.find(item=>item[1]?.email === email)) {
        await sendPasswordResetEmail(auth, email)
        Toastify({
            text: "Reset Link sent ",
            duration: 2000,
            style:sucessStyles,
         }).showToast()
       setTimeout(() => {
         window.location= "/auth/login.html"
       }, 2000);
    } else {
        Toastify({
            text: "No user Found!",
            duration: 2000,
            style:errorStyles,
         }).showToast()
    }
   } catch (error) {
    Toastify({
        text:error?.message,
        duration: 2000,
        style:errorStyles,
     }).showToast()
   }
}