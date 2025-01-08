import { loginUser, emailRegex, passwordRegex } from "./auth-actions.js"
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
        Toastify({
            text: "Invalid Credentials",
            duration: 2000,
            style:errorStyles
        }).showToast()
        isLoading = false
    }
    else {
    const newPassword = passwordRegex.test(password)
    const newEmail = emailRegex.test(email)

    if (!newEmail) {
        console.log("Invalid Email");  
    } 

    if (!newPassword) {
        console.log("Password should contain six Numerical characters ");  
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