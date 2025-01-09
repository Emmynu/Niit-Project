import { onAuthStateChanged, signOut  }  from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { auth } from "./firebase-config.js";
import {  redirect } from "./auth-actions.js";
import { sideBarComponent, dashboardNav } from "./component.js";

const token =  JSON.parse(localStorage.getItem("token"))


// protecting the home route against unauthenticated and unauthorized users
window.addEventListener("DOMContentLoaded", async()=>{
   onAuthStateChanged(auth,(user)=> {
       if (!user?.emailVerified || !token) {
            redirect("/auth/login.html")
       }
       setTimeout(() => {
        document.querySelector(".user-container").innerHTML = `
        <img src="${user?.photoURL}" alt="${user?.displayName}" class="user-profile">
       <div>
           <p>${user?.displayName}</p>
           <span>${user?.email}</span>
        </div>
        `
       }, 0);
       
    })    
})

// getiing the repeated part of the dashboard and displaying it when the page loads to prevent repition of html code
window.addEventListener("DOMContentLoaded",()=>{
  document.querySelector(".side-bar-lg-container").innerHTML = sideBarComponent
  document.querySelector(".dashboard-nav-container").innerHTML = dashboardNav
})



// has to wait for the page to load to get the dom needed
setTimeout(() => {
  document.querySelector(".close-btn").addEventListener("click",()=>{
    document.querySelector(".side-bar-container").classList.toggle("hide")
})

document.querySelector(".nav-bar-container").addEventListener("click",()=>{   
  document.querySelector(".side-bar-container").classList.add("show")
  document.querySelector(".side-bar-container").classList.remove("hide")
  
})

document.querySelectorAll("#logout").forEach(btn=>{
  btn.addEventListener("click",()=>{
    signOut(auth)
    localStorage.removeItem("token")
    redirect("/auth/login.html")
    
})
})

}, 0);



// export async function walletBalance() {
//   try {
//     const users =  await getUserInDb()
//     const newUser = users.filter(user => user[1]?.id === auth?.currentUser?.uid)
//     if (newUser) {
//         // display balace and account number
//         const accountInfo = newUser.map(user => user[1])
//         balanceDOM.innerHTML = `Balance:  ₦${accountInfo[0]?.balance.toFixed(2)}`
//     } else {
//         showToast("User not found!")
//         redirect("/auth.register.html")
//     }
//   } catch (error) {
//     showToast(error?.message, errorStyles)
//   }
// }


