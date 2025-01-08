import { auth } from "./firebase-config.js";
import { createUser, nameRegex, emailRegex, passwordRegex, googleAuth } from "./auth-actions.js";
import { errorStyles } from "./toastify.js";


const registerForm = document.querySelector("#register")
const googleBtn =  document.querySelector(".google-btn")
const btn  = document.querySelector(".form-btn")
let isLoading = false

document.addEventListener("DOMContentLoaded",()=>{
    auth.useDeviceLanguage()
})

registerForm.addEventListener("submit", async (e)=>{
    e.preventDefault()
    isLoading =  true
    const  {name, email, password, checkbox} = Object.fromEntries(new FormData(e.currentTarget)) // get the values of the inputs    

    if (isLoading) {
        btn.disabled = true
        btn.innerHTML = "Loading..."
    }


    if (!name || !email || !password  ) {
       Toastify({
        text: "Invalid Credentials",
        duration: 2000,
        style:errorStyles
       }).showToast()
    isLoading = false
    }
    else {
        const newName = nameRegex.test(name)
        const newPassword = passwordRegex.test(password)
        const newEmail = emailRegex.test(email)

        if (!newName) {
            Toastify({
                text: "Name should contain Alphabetic characters",
                duration: 2000,
                style:errorStyles,
            }).showToast()
        } 

        if (!newEmail) {
            Toastify({
                text: "Invalid Email",
                duration: 2000,
                style:errorStyles,
            }).showToast()
        } 
        if (checkbox === undefined) {  
            Toastify({
                text: "Agree with the terms & conditons to proceed",
                duration: 2000,
                style:errorStyles,
            }).showToast()
        } 

        if (!newPassword) {
            Toastify({
                text: "Password should contain six Numerical characters ",
                duration: 2000,
                style:errorStyles,
            }).showToast()
        } 


        if (newEmail && newName && newPassword && checkbox === "on") {
            // create the user with the email and password
            await createUser(email, password, name)
        }
        isLoading = false

    }

    if (!isLoading) {
        btn.disabled = false
        btn.innerHTML = "Create an Account"
    }
})


googleBtn.addEventListener("click",async()=>{
    await googleAuth()
})