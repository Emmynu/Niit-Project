import { getUserInDb, showToast } from "./auth-actions.js"
import { auth, db } from "./firebase-config.js"
import { walletBalance } from "./index.js";
import { errorStyles, sucessStyles } from "./toastify.js"
import { update, ref, increment, push } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";


const depositForm = document.querySelector(".deposit-form")
const depositBtn = document.querySelector(".deposit-btn")
const depositInput = document.querySelector(".deposit-form input")
let isProcessed = false

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
        id:auth?.currentUser?.uid,
        name: auth?.currentUser?.displayName,
        email: auth?.currentUser?.email,
        amount: newAmount,
      }
       await depositFunc(data)
       depositForm.reset()
    }
})



export async function depositFunc(data) {
  const { name, email , amount, id} = data
  
  window.Korapay.initialize({
    key: "pk_test_PHfVru7a8V9Dum9fnXEritZke3nEU8UTXiAtSDwb",
    reference: new Date().getTime().toString(),
    amount: amount, 
    currency: "NGN",
    customer: {
      name,
      email
    },
    onClose: ()=>{
      showToast("Popup closed by user!", errorStyles)
    },
    onFailed:async()=>{
      await saveTransaction("Failed",amount,new Date().toDateString(), id,email,"deposit", name)
      showToast("Transaction Failed, Please try again!", errorStyles)
    },
    onSuccess: async function () {
      // cause the onSuccess runs twice which result to double saving
      if (!isProcessed) {
        isProcessed = true
        await updateBalance(email, amount)
        await walletBalance()
        await saveTransaction("Success",amount, new Date().toDateString(), id,email,"deposit", name)
        showToast("Transaction Sucessful!", sucessStyles)
      }
    },
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

export async function saveTransaction(status, amount, time, id, email,type, name) {
  await push(ref(db, `transactions/${id}`),{
    status,
    amount,
    createdAt:time,
    user:{
      id,
      name,
      email,
    },
    type,
  })
}

