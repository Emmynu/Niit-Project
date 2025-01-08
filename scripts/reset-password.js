import { emailRegex, sendResetPasswordLink } from "./auth-actions.js";
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
            Toastify({
                text: "Invalid Credentials",
                duration: 2000,
                style:errorStyles
            }).showToast()
            isLoading = false
        }
        else {
        const newEmail = emailRegex.test(email)

        
        if (!newEmail) {
            Toastify({
                text: "Invalid Email",
                duration: 2000,
                style:errorStyles
            }).showToast()
            
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