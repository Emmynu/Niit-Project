import { getUserInDb, redirect, showToast } from "./auth-actions.js"
import { auth } from "./firebase-config.js"
import { errorStyles, sucessStyles } from "./toastify.js"
import { updateBalance, saveTransaction, getTransaction } from "./index.js"


let recipient = []
let sender = []
let isLoading = false
let isPending = false
let isBeneficaryLoading = false

window.addEventListener("DOMContentLoaded", async()=>{
    isBeneficaryLoading = true
    if (isBeneficaryLoading) {
        document.querySelector(".transfer-history").innerHTML = `<div class="loading"><img  src="/images/loading.gif" alt="Loading"></div>`
        
    }
    const transactions = await getTransaction()
    const newTransactions = transactions.filter(transaction=>{
        if ((transaction[1]?.type === "transfer") && (transaction[1]?.user?.id === auth?.currentUser?.uid)) {
            return true
        } else {
            return false
        }
    })

    const recipients = (newTransactions.map(transaction => transaction[1]?.recipient))
    const set = new Set() // or getting unique and unrepeated values in an array

    recipients.map(receiver => {
        set.add(receiver?.name)
        set.add(receiver?.accountNumber)
    })

    
    const array = Array.from(set);
    const uniqueRecipients = [];
    
  
    for (let i = 0; i < array.length; i += 2) {
      const name = array[i];
      const accountNumber = array[i + 1];
  
      // Check if accountNumber is defined to prevent errors if the Set has an odd number of elements.
      if (accountNumber !== undefined) {
          uniqueRecipients.push({ name, accountNumber });
      } else {
          console.warn("Odd number of elements in Set. Last name has no associated account number")
      }
    }
  
    let result = ""
    uniqueRecipients.reverse().map(user =>{
        result += `
        <div class="transfer-beneficiary-container">
            <img src="/images/transfer-profile.png" alt="">
            <section> <h2>${user?.name}</h2>
                <h4>${user?.accountNumber}</h4></section>
        </div>
        `
    })

    isBeneficaryLoading = false
    

    if (newTransactions.length > 0) {
        document.querySelector(".transfer-history").innerHTML = result
        document.querySelector(".transfer-history").classList.add("scroll")
    } else {
        document.querySelector(".transfer-history").innerHTML =  `
        <section class="transaction-empty">
            <img src="https://th.bing.com/th/id/OIP.ZsjPQuS9XJsVY_JFsHvn9QHaHa?rs=1&pid=ImgDetMain" alt="">
            <h2>Transaction History empty</h2>
        </section>`
        
    }
    
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
                await saveTransaction("sucess",parseInt(amountDom),sender[0][1]?.id,sender[0][1]?.email,"transfer",sender[0][1]?.name,receiver)
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
  