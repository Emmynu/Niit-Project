import { getUserInDb, redirect, showToast } from "./auth-actions.js"
import { auth } from "./firebase-config.js"
import { errorStyles, sucessStyles } from "./toastify.js"
import { updateBalance, saveTransaction, getTransaction } from "./index.js"


let recipient = []
let sender = []
let isLoading = false
let isPending = false

window.addEventListener("DOMContentLoaded", async()=>{
    const transactions = await getTransaction()
    const newTransactions = transactions.filter(transaction=>{
        if ((transaction[1]?.type === "transfer") && (transaction[1]?.user?.id === auth?.currentUser?.uid)) {
            return true
        } else {
            return false
        }
    })

    console.log(newTransactions);
    
    
})

document.querySelector(".vector-form-container").addEventListener("submit", async (e) => {
    e.preventDefault()
    const { vectorNumber } = Object.fromEntries(new FormData(e.currentTarget))
    isLoading = true

    if (isLoading) {
        document.querySelector(".account-btn").innerHTML =  "Loading..."
        document.querySelector(".account-btn").disabled = true
        
    }
    if (vectorNumber.length < 10) {
        showToast("Please enter a valid 10-digit account number.", errorStyles)
        document.querySelector(".account-info").innerHTML = ``
        document.querySelector(".error").innerHTML = ``
        document.querySelector(".transfer-btn").disabled = true
        isLoading = false
    }
    else if (vectorNumber.length > 10) {
        showToast("Please enter a valid 10-digit account number.", errorStyles)
        document.querySelector(".account-info").innerHTML = ``
        document.querySelector(".error").innerHTML = ``
        document.querySelector(".transfer-btn").disabled = true
        isLoading = false
    }
    else{
     try {
        const users = await getUserInDb() // 1399620272
        const userInfo = users.filter(user=>user[1]?.accountNumber === (vectorNumber))
        const currentUser = users.filter(user=>user[1]?.id === auth?.currentUser?.uid)
        const senderAccountNumber = currentUser.map(u=> u[1]?.accountNumber)
        
        
        if ((senderAccountNumber[0]) === (vectorNumber)) {
            document.querySelector(".error").innerHTML = `${vectorNumber} is your account number, Please enter a valid account number`
            document.querySelector(".account-info").innerHTML = ``
        } else {
            if (userInfo.length > 0) { 
                const res = userInfo.map(user => user[1])    
               document.querySelector(".account-info").innerHTML = `
                    <h4>Transfer to ${res[0]?.name}</h4>
                `
                document.querySelector(".error").innerHTML = ``
                document.querySelector(".transfer-btn").disabled = false
                recipient = userInfo
                sender = currentUser
            }else{
                document.querySelector(".error").innerHTML = `
                No result Found, Please enter recipient's account number 
            `
            document.querySelector(".account-info").innerHTML = ``
            document.querySelector(".transfer-btn").disabled = true
            }      
        }
     

     } catch (error) {
        showToast(error?.message, errorStyles)
     }
     isLoading = false

    
    }
    if (!isLoading) {
        document.querySelector(".account-btn").innerHTML =  "Continue"
        document.querySelector(".account-btn").disabled = false
    }

  })
  

  document.querySelector(".transfer-btn").addEventListener("click", async()=>{
    const amountDom = document.querySelector(".transfer-amount").value
    isPending = true

    if (isPending) {
        document.querySelector(".transfer-btn").innerHTML =  "Loading..."
        document.querySelector(".transfer-btn").disabled = true
        document.querySelector(".account-btn").disabled = true
    }
    
    if (amountDom <= 0) {
        showToast("Please enter amount", errorStyles)
        
    }
    if (amountDom < 10) {
        showToast("The minimum transfer amount is ₦10", errorStyles)
    }
    
    if (recipient.length > 0 && amountDom >= 10) {
    
        if ( parseInt(amountDom) > (sender[0][1]?.balance) ) {
            showToast("Insufficient funds, Plese top up", errorStyles)

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
        isPending = false


        if (!isPending) {
            document.querySelector(".transfer-btn").innerHTML =  "Enter"
            document.querySelector(".transfer-btn").disabled = false
            document.querySelector(".account-btn").disabled = false
        }
    }
  
    
  })
  