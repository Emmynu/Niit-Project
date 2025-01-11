import { onAuthStateChanged, signOut  }  from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"; 
import { update, ref, increment, push, get, child } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import { auth, db } from "./firebase-config.js";
import {  redirect,showToast , getUserInDb} from "./auth-actions.js";
import { sideBarComponent, dashboardNav } from "./component.js";
import { errorStyles } from "./toastify.js";


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
    await walletBalance()  
})

// getiing the repeated part of the dashboard and displaying it when the page loads to prevent repition of html code
window.addEventListener("DOMContentLoaded",async ()=>{
  document.querySelector(".side-bar-lg-container").innerHTML = sideBarComponent
  document.querySelector(".dashboard-nav-container").innerHTML = dashboardNav
  await displayTransactions()
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




export async function walletBalance() {
  try {
    const users =  await getUserInDb()
    const newUser = users.filter(user => user[1]?.id === auth?.currentUser?.uid)
    if (newUser) {
        // display balace and account number
        const accountInfo = newUser.map(user => user[1])        
        document.querySelector(".balance").innerHTML = `₦${accountInfo[0]?.balance.length > 9 ? accountInfo[0]?.balance.toFixed(2).toLocaleString('en-US').slice(0,6) : accountInfo[0]?.balance.toFixed(2).toLocaleString('en-US')}`
        document.querySelector(".account-number").innerHTML = `${accountInfo[0]?.accountNumber}`
    } else {
        showToast("User not found!")
        redirect("/auth.register.html")
    }
  } catch (error) {
    showToast(error?.message, errorStyles)
  }
}

export async function updateBalance(email, amount) {
  try {
    const users = await getUserInDb()
    const user =  users.filter(user=>user[1]?.email === email)
    const updates = {}
    updates[`/users/${user[0][0]}/balance`]  = increment(amount)
    return update(ref(db),  updates)
  } catch (error) {
   showToast(error?.message, errorStyles);
    
  }
}


export async function saveTransaction(status, amount, time, id, email,type, name, recipient) {
  await push(ref(db, `transactions/`),{
    status,
    amount,
    createdAt:time,
    user:{
      id,
      name,
      email,
    },
    type,
    recipient,
  })
}

export async function getTransaction() {
  const dbRef = ref(db)
  const transactions =  get(child(dbRef, "transactions/")).then(res=>res?.exists()? Object.entries(res.val()): [])
  return transactions
}

export  async function  displayTransactions() {
  const transactions =  await getTransaction()
  const newTransactions =  transactions.filter(transaction=> (transaction[1]?.user?.id === auth?.currentUser?.uid) || (transaction[1]?.recipient?.id === auth?.currentUser?.uid)).reverse()
  let transactionDOM = ""
  newTransactions.map(transaction=>{
    transactionDOM += 
     ` 
     <article class="transaction-details">
        <div >
          <img src=${transaction[1]?.type === "deposit" ? 
            "https://img.icons8.com/?size=100&id=122074&format=png&color=000000"
            : 
            (transaction[1]?.type === "transfer" && transaction[1]?.recipient?.id !== auth?.currentUser?.uid) ?
              `https://img.icons8.com/?size=100&id=7801&format=png&color=000000` :
              `https://img.icons8.com/?size=100&id=7800&format=png&color=000000`} class=${transaction[1]?.type} alt=""/> 

          <section class="transaction-type-container">
              <h2>${transaction[1]?.type === "deposit" ? 
                "Deposit" : 
                (transaction[1]?.type === "transfer" && transaction[1]?.recipient?.id !== auth?.currentUser?.uid) ?
                  `Transfer To ${transaction[1]?.recipient?.name}` :
                `Transfer from ${transaction[1]?.user?.name}`}</h2>
              <p>${transaction[1]?.createdAt}</p>
          </section>
        </div>

        <div>
          <h5 >${transaction[1]?.type === "deposit" ? 
            `+₦${transaction[1]?.amount}` : 
            (transaction[1]?.type === "transfer" && transaction[1]?.recipient?.id !== auth?.currentUser?.uid) ?
              `-₦${transaction[1]?.amount}` :
            `+₦${transaction[1]?.amount}`}</h5>
            <p>${transaction[1]?.status}</p>
        </div>  
      
    </article>`
  })


    if ( newTransactions.length > 0) {
      document.querySelector(".transaction-history").innerHTML = transactionDOM
      document.querySelector(".transaction-history").classList.add("scroll")
    } else {
      document.querySelector(".transaction-history").innerHTML= `
      <section class="transaction-empty">
          <img src="https://th.bing.com/th/id/OIP.ZsjPQuS9XJsVY_JFsHvn9QHaHa?rs=1&pid=ImgDetMain" alt="">
          <h2>Transaction History empty</h2>
      </section>`
    }
    
  
}