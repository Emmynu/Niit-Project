import {  showToast } from "./auth-actions.js"
import { auth, db } from "./firebase-config.js"
import { displayTransactions, walletBalance } from "./index.js";
import { errorStyles, sucessStyles } from "./toastify.js"
import { updateBalance, saveTransaction } from "./index.js";


let isProcessed = false

document.querySelector(".deposit-form input").addEventListener("keyup",()=>{
  if(document.querySelector(".deposit-form input").value >= 1){
    document.querySelector(".deposit-btn").disabled =  false
  }else{
    document.querySelector(".deposit-btn").disabled =  true
  }
})


document.querySelector(".deposit-form").addEventListener("submit",async(e)=>{
    e.preventDefault() 
    const  { amount } =  Object.fromEntries(new FormData(e.currentTarget))
    const newAmount = parseFloat(amount)
    if(!amount){
      showToast("Amount cannot be empty", errorStyles)
    }

    if (newAmount < 100) {
        showToast("Amount should be greater than #99", errorStyles)
    } else {
      const data = {
        id:auth?.currentUser?.uid,
        name: auth?.currentUser?.displayName,
        email: auth?.currentUser?.email,
        amount: newAmount,
      }
       await depositFunc(data)
       document.querySelector(".deposit-form").reset()
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
      await displayTransactions()
    },
    onSuccess: async function () {
      // cause the onSuccess runs twice which result to double saving
      if (!isProcessed) {
        isProcessed = true
        await updateBalance(email, amount)
        await walletBalance()
        await saveTransaction("Success",amount, new Date().toDateString(), id,email,"deposit", name, null)
        showToast("Transaction Sucessful!", sucessStyles)
        await displayTransactions()
      }
    },
});
}



