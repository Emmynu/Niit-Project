import { onAuthStateChanged  }  from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"; 
import { auth } from "./firebase-config.js";

const token =  JSON.parse(localStorage.getItem("token"))




// protecting the home route against unauthenticated and unauthorized users
window.addEventListener("DOMContentLoaded", async()=>{
   onAuthStateChanged(auth,(user)=> {
       if (!user?.emailVerified || !token) {
            window.location = ("/auth/login.html")
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