import { loginUser, emailRegex, passwordRegex, googleAuth, showToast } from "./auth-actions.js"
import { errorStyles } from "./toastify.js"

const loginForm = document.querySelector("#login")
const googleBtn =  document.querySelector(".google-btn")
const btn  = document.querySelector(".form-btn")
let isLoading = false
 
loginForm.addEventListener("submit", async (e)=>{
    e.preventDefault()
    isLoading =  true
    const  { email, password} = Object.fromEntries(new FormData(e.currentTarget)) // get the values of the inputs

    if (isLoading) {
        btn.disabled = true
        btn.innerHTML = "Loading..."
    }

    if ( !email || !password  ) {
      showToast("Invalid Credentials", errorStyles)
        isLoading = false
    }
    else {
    const newPassword = passwordRegex.test(password)
    const newEmail = emailRegex.test(email)

    if (!newEmail) {
       showToast("Invalid Email", errorStyles)
    } 

    if (!newPassword) {
        showToast("Password should contain six Numerical characters", errorStyles)
    } 


    if (newEmail  && newPassword ) {
        // login the user with the email and password
        await loginUser(email, password)
    }
    isLoading = false
    }
    if (!isLoading) {
    btn.disabled = false
    btn.innerHTML = "Login to Account"
}
})

googleBtn.addEventListener("click",async()=>{
    await googleAuth()
})