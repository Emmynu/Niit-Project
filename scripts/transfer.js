import { getUserInDb, redirect, showToast } from "./auth-actions.js"
import { auth } from "./firebase-config.js"
import { errorStyles, sucessStyles } from "./toastify.js"
import { updateBalance, saveTransaction } from "./index.js"


let recipient = []
let sender = []

document.querySelector(".vector-form-container").addEventListener("submit", async (e) => {
    e.preventDefault()
    const { vectorNumber } = Object.fromEntries(new FormData(e.currentTarget))
    if (vectorNumber.length < 10) {
        showToast("Account Number too short", errorStyles)
    }
    else{
     try {
        const users = await getUserInDb() // 1399620272
        const userInfo = users.filter(user=>user[1]?.accountNumber === (vectorNumber))
        const currentUser = users.filter(user=>user[1]?.id === auth?.currentUser?.uid)
        const senderAccountNumber = currentUser.map(u=> u[1]?.accountNumber)
        console.log(users);
        
        
        if ((senderAccountNumber[0]) === (vectorNumber)) {
            document.querySelector(".account-info").innerHTML = `
            <h2>You cant send money to yourself </h2>
        `
        } else {
            if (userInfo.length > 0) { 
                const res = userInfo.map(user => user[1])    
               document.querySelector(".account-info").innerHTML = `
                    <h2>${res[0]?.name}</h2>
                    <p>${res[0]?.accountNumber}</p>
                `
                document.querySelector(".transfer-btn").disabled = false
                recipient = userInfo
                sender = currentUser
            }else{
                document.querySelector(".account-info").innerHTML = `
                <h2>No result Found, Please enter recipient's account number </h2>
            `
            document.querySelector(".transfer-btn").disabled = true
            }
              
        }
    
     } catch (error) {
        showToast(error?.message, errorStyles)
     }
    }
  })


  document.querySelector(".transfer-btn").addEventListener("click", async()=>{
    const amountDom = document.querySelector(".transfer-amount").value
    
    if (amountDom <= 0) {
        showToast("Please enter amount", errorStyles)
    }
    if (amountDom < 10) {
        showToast("Amount should be greater than #9", errorStyles)
    }
    
    if (recipient.length > 0 && amountDom >= 10) {
    
        if ( parseInt(amountDom) > (sender[0][1]?.balance) ) {
            showToast("Amount too big, Please top up", errorStyles)

        } else {
          
            try {
                //update senders balance   
                await updateBalance(sender[0][1]?.email, -parseInt(amountDom))
                // update recipient balance
                await updateBalance(recipient[0][1]?.email, +parseInt(amountDom))
                // save transaction
                const receiver = {
                    id:recipient[0][1]?.id,
                    name:recipient[0][1]?.name,
                    email:recipient[0][1]?.email,
                    accountNumber: recipient[0][1]?.accountNumber,

                }
                await saveTransaction("sucess",parseInt(amountDom),new Date().toDateString(),sender[0][1]?.id,sender[0][1]?.email,"transfer",sender[0][1]?.name,receiver)
                showToast("Transaction Succesful", sucessStyles)
                redirect("/")
            } catch (error) {
                showToast(error?.message, errorStyles)
            }
        }
    }
  })
  