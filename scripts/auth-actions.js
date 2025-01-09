import { auth, db, provider } from "./firebase-config.js";
import {  createUserWithEmailAndPassword , updateProfile, sendEmailVerification,signInWithEmailAndPassword,sendPasswordResetEmail,signInWithPopup }  from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
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
       await saveUserToDb(user, "Password")
       localStorage.setItem("token", JSON.stringify(user?.accessToken)) //save the token to local storage
       // send email verification link
       await sendEmailVerification(user)
      showToast("Email Verfication Link sent", sucessStyles)
       redirect("/auth/login.html")
    } catch (error) {
      showToast(error?.message, errorStyles)
    }
}

export async function saveUserToDb(user, authProvider) {
try {
    const {uid, email, photoURL,displayName} = user
    await push(ref(db, `users/`),{
    name:displayName,
    email, 
    url:photoURL,
    id:uid,
    provider: authProvider,
    balance: 0,
    accountNumer: generateAccountNumber()
    })
} catch (error) {
    showToast(error?.message, errorStyles)
    
}
}


export async function loginUser(email, password) {
    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password)
        localStorage.setItem("token", JSON.stringify(user?.accessToken)) // new token for new session
        if (!user?.emailVerified) {
            showToast("Verify your account", sucessStyles)
        } else {
            showToast("Successfully LoggedIn", sucessStyles)
            redirect("/")
        }
    } catch (error) {
        showToast(error?.message, errorStyles)     
    }
    
    
}

export async function getUserInDb() {
   try {
    const dbRef = ref(db)
    const user =  get(child(dbRef, `users/`)).then(res=> res.exists()? Object.entries(res.val()) : [])
    return user
   } catch (error) {
    showToast(error?.message, errorStyles)
   }
}

export async function sendResetPasswordLink(email) {
   try {
    const user =  await getUserInDb()
    if (user?.find(item=>item[1]?.email === email)) {
        await sendPasswordResetEmail(auth, email)
       showToast("Reset Link sent", sucessStyles)
      redirect("/auth/login.html")
    } else {
        showToast("No user Found", errorStyles)
    }
   } catch (error) {
    showToast(error?.message, errorStyles)

   }
}

export async function googleAuth() {
    try {
        const { user } = await signInWithPopup(auth, provider)
        const res = await getUserInDb()

        if(!res?.find(item=>item[1]?.id === user?.uid)){
            await saveUserToDb(user, "Google") 
        }
        localStorage.setItem("token",JSON.stringify(user?.accessToken))
       showToast("Authentication Successful", sucessStyles)
        redirect("/")
    } catch (error) {
        showToast(error?.message, errorStyles)
    }
}

function generateAccountNumber() {
    let accountNumer =  ""
    for (let i = 0; i < 10; i++) {
        accountNumer += Math.floor(Math.random()* 10)
    }
    return accountNumer
}


export function redirect(url) {
    setTimeout(() => {
        window.location = url
    }, 2000);
}

export function showToast(message, style) {
    Toastify({
        text:message,
        duration: 2000,
        style:style,
     }).showToast()
}

