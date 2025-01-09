import { onAuthStateChanged, signOut  }  from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { auth } from "./firebase-config.js";
import { getUserInDb, redirect, showToast } from "./auth-actions.js";
import { errorStyles } from "./toastify.js";

const token =  JSON.parse(localStorage.getItem("token"))
const balanceDOM  = document.querySelector(".balance")
const userDOM  = document.querySelector(".user-container")
const logOutBtn  = document.querySelector("#logout")
// protecting the home route against unauthenticated and unauthorized users
window.addEventListener("DOMContentLoaded", async()=>{
   onAuthStateChanged(auth,(user)=> {
       if (!user?.emailVerified || !token) {
            redirect("/auth/login.html")
       }
        userDOM.innerHTML = `
         <img src="${user?.photoURL}" alt="${user?.displayName}" class="user-profile">
        <div>
            <p>${user?.displayName}</p>
            <span>${user?.email}</span>
         </div>
         `
       
    })    
    await walletBalance()
})


logOutBtn.addEventListener("click",()=>{
    signOut(auth)
    localStorage.removeItem("token")
    redirect("/auth/login.html")
    
})

export async function walletBalance() {
  try {
    const users =  await getUserInDb()
    const newUser = users.filter(user => user[1]?.id === auth?.currentUser?.uid)
    if (newUser) {
        // display balace and account number
        const accountInfo = newUser.map(user => user[1])
        balanceDOM.innerHTML = `Balance:  ₦${accountInfo[0]?.balance.toFixed(2)}`
    } else {
        showToast("User not found!")
        redirect("/auth.register.html")
    }
  } catch (error) {
    showToast(error?.message, errorStyles)
  }
}


