import { emailRegex, sendResetPasswordLink, showToast } from "./auth-actions.js";
import { errorStyles } from "./toastify.js";

const resetForm = document.querySelector("#reset-password")
const btn  = document.querySelector(".form-btn")
let isLoading = false

resetForm.addEventListener("submit",async(e)=>{
    e.preventDefault()
    isLoading =  true
    const  { email} = Object.fromEntries(new FormData(e.currentTarget)) // get the values of the inputs

       if (isLoading) {
            btn.disabled = true
            btn.innerHTML = "Loading..."
        }

        if (!email) {
            showToast("Invalid Credentials", errorStyles)
            isLoading = false
        }
        else {
        const newEmail = emailRegex.test(email)

        
        if (!newEmail) {
            showToast("Invalid Email", errorStyles)
            
        } 

        if (newEmail ) {
            //send password reset link
            await sendResetPasswordLink(email)
            
        }
        isLoading = false
        }
        if (!isLoading) {
            btn.disabled = false
            btn.innerHTML = "Reset Password"
        }
})