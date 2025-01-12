import { auth } from "./firebase-config.js";
import { getUserInDb } from "./auth-actions.js";
import { onAuthStateChanged  }  from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

let isLoading  = true

if(isLoading){
   document.querySelector(".details-container").innerHTML = "<section class='loading'><img  src='/images/loading.gif' </img></section>"
}

window.addEventListener("DOMContentLoaded",async()=>{
    const users =  await getUserInDb()
    if (users.length > 1) {
        isLoading = false
        onAuthStateChanged(auth,user =>{ 
            const newUser =  users.filter(person=>person[1]?.id === user?.uid)
            const profile = newUser.map(user => user[1]) 
     
            document.querySelector(".name").innerHTML = `${profile[0]?.name}!`
            if (user?.emailVerified) {
                 document.querySelector(".label").textContent = "Congratulations, Your account is verified!"
            } else {
                 document.querySelector(".label").textContent = "Looks like you are not verified yet, Verify your account to use the full potentials of Vector Pay"
            }
            if (!isLoading) {
                const profileDetails = document.createElement("section")
                profileDetails.innerHTML = `
                <section class="profile-details">
                    <header>
                        <h3>Profile Details</h3>
                    </header>
                    <article class="details">
                        <div>
                            <h4>User ID</h4>
                            <p>${profile[0]?.id}</p>
                        </div>
                        <div>
                            <h4>Name</h4>
                            <p>${profile[0]?.name}</p>
                        </div>
                        <div>
                            <h4>Email</h4>
                            <p>${profile[0]?.email}</p>
                        </div>

                        <div>
                            <h4>Joined</h4>
                            <p>${user?.metadata?.creationTime}</p>
                        </div>
                        <div>
                            <h4>Account Number</h4>
                            <p>${profile[0]?.accountNumber}</p>
                        </div>
                        <div>
                            <h4>Account Type</h4>
                            <p>Personal</p>
                        </div>
                </article>
                <section> `
             document.querySelector(".details-container").append(profileDetails)
            }
         })
    }    
    if(!isLoading){
        const profile = document.createElement("section")
        profile.innerHTML = `<section class="profile">
            <article>
                <img src="/images/profile.png" alt="">
                <h3>Welcome, <span class="name"></span></h3>
                <p class="label"></p>
            </article>
        <section>`
        document.querySelector(".details-container").append(profile)
        document.querySelector(".loading").style.display = "none"
    }
})

