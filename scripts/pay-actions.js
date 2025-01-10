import { getUserInDb, showToast } from "./auth-actions.js"
import { auth, db } from "./firebase-config.js"
import { walletBalance } from "./index.js";
import { errorStyles } from "./toastify.js"
import { update, ref, increment } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";


const depositForm = document.querySelector(".deposit-form")
const depositBtn = document.querySelector(".deposit-btn")
const depositInput = document.querySelector(".deposit-form input")

depositInput.addEventListener("keyup",()=>{
  if(depositInput.value >= 1){
    depositBtn.disabled =  false
  }else{
    depositBtn.disabled =  true
  }
})


depositForm.addEventListener("submit",async(e)=>{
    e.preventDefault() 
    const  { amount } =  Object.fromEntries(new FormData(e.currentTarget))
    const newAmount = parseFloat(amount)
    if(!amount){
      showToast("Amount cannot be empty", errorStyles)
    }

    if (newAmount < 100) {
        showToast("Amount should be greater than 100", errorStyles)
    } else {
      const data = {
        name: auth?.currentUser?.displayName,
        email: auth?.currentUser?.email,
        amount: newAmount,
      }
      await depositFunc(data)
    }
})



export async function depositFunc(data) {
  const { name, email , amount} = data
  window.Korapay.initialize({
    key: "pk_test_PHfVru7a8V9Dum9fnXEritZke3nEU8UTXiAtSDwb",
    reference: new Date().getTime().toString(),
    amount: amount, 
    currency: "NGN",
    customer: {
      name,
      email
    },
    onClose: async()=>{
      showToast("Popup closed by user!", errorStyles)
    },
    onFailed:()=>{
      showToast("Transaction Failed, Please try again!", errorStyles)
    },
    onSuccess:async()=>{
      await updateBalance(email, amount)
      await walletBalance()
      showToast("Transaction Sucessful!")
    }
});
}

async function updateBalance(email, amount) {
  try {
    const users = await getUserInDb()
    const user =  users.filter(user=>user[1]?.email === email)
    const updates = {}
    updates[`/users/${user[0][0]}/balance`]  = increment(amount)
    return update(ref(db),  updates)
  } catch (error) {
    console.log(error?.message);
    
  }
}