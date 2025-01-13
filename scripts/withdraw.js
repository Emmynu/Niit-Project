
import { getUserInDb, redirect, showToast } from "./auth-actions.js";
import { auth } from "./firebase-config.js";
import { saveTransaction, updateBalance } from "./index.js";
import { errorStyles, sucessStyles } from "./toastify.js";

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
const paystackKey = "Bearer sk_test_6110965c55686414101558079e8179ec65af0d73"
const korapayKey = "Bearer sk_test_Q7jYotBnMuNe4ZUNF76VTuHvVjgRrnH9eEULALgg"

const banksContainer =  document.querySelector(".banks")
const bankDetails =  document.querySelector(".bank-details")
const formBtn = document.querySelector(".form-btn")
const amountBtn = document.querySelector(".amount-btn")
let recipient = {}
let isLoading = false
let isPending = false

// get banks
window.addEventListener("DOMContentLoaded",async()=>{
    isLoading =  true
    if(isLoading){
       document.querySelector(".error").innerHTML = `<h2 style="color:black; font-size:14px">Loading....</h2>`
       formBtn.disabled =  true
    //    amountBtn.disabled =  true
    }
    myHeaders.append("Authorization",paystackKey)
    const data = await fetch("https://api.paystack.co/bank",{
        headers:myHeaders
    }).then(res=>res.json())
    .then(res=> {return res})
    .catch(err=>{return { error: err?.message }})

    if (data.error) {
      document.querySelector(".error").innerHTML = "Failed to fetch banks"
      document.querySelector(".bank-container").innerHTML = ""
      formBtn.disabled =  true
      amountBtn.disabled =  true
        
    }else{
        let result = ""
       data?.data?.map(res=>{
            result += `
                <option value=${res?.code}>${res.name}</option>
            `
       })
        isLoading = false
        banksContainer.innerHTML = result
    }
    if (!isLoading) {
        document.querySelector(".error").innerHTML = "" 
       formBtn.disabled =  false
    }
    
})


document.querySelector("form").addEventListener("submit", async(e)=>{
    e.preventDefault()
    isPending = true
    const { accountNumber, banks } =  Object.fromEntries(new FormData(e.currentTarget))

    if (isPending) {
        formBtn.innerHTML = "Loading..."
        formBtn.disabled = true
    }
    if (accountNumber.length === 10 && banks) {
        // verify bank details Provided
        const details =  await verifyBankDetails(banks, accountNumber)
        // console.log(details);
        if (details.error) {
            bankDetails.innerHTML = `<h2>${details.error}</h2>`
        } else if(details.status === false ) {
            bankDetails.innerHTML = `<h2>${details.message}</h2>`
        }
        else{
            recipient = details?.data
            bankDetails.innerHTML = `<h2>${details?.data?.account_name}</h2>`
            amountBtn.disabled =  false
        }
        
    }
    else if(accountNumber.length < 10 || accountNumber.length > 10){
        showToast("Please provide a valid 10 digit account number", errorStyles);
    }
    else if(!banks){
        showToast("Please select a bank", errorStyles);  
    }
    isPending = false
    if (!isPending) {
        formBtn.disabled = false
        formBtn.innerHTML = "Continue"
    }
})

async function verifyBankDetails(code, accountNumber) {
    myHeaders.append("Authorization", korapayKey)

    var raw = JSON.stringify({
        "bank": code,
        "account": accountNumber,
        "currency": "NGN",
    });
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

     const data = await fetch("https://api.korapay.com/merchant/api/v1/misc/banks/resolve", requestOptions).then(res=>res.json()).then(res=>{return res
    }).catch(err=> {return {error:err?.message}})  
    return data
}



amountBtn.addEventListener("click", async()=>{

    const amount =  document.querySelector(".amount").value
    const  { email, uid, displayName} =  auth?.currentUser

    if(amount < 100){
        showToast("The minimum withdrawal amount is ₦100", errorStyles)

    }
    const users = await getUserInDb()
    const currentUser = users.filter(user=> user[1]?.id === uid)    
    if (currentUser && recipient?.account_name && parseInt(amount) >= 100 ) {
           if ( parseInt(amount) >  currentUser[0][1]?.balance ) {
            showToast("Insufficient funds, Plese top up", errorStyles)

           } else {
                try {
                    await updateBalance(auth?.currentUser?.email, parseInt(-amount))
                    const accountRecipient ={
                        name: recipient?.account_name,
                        accountNumber: recipient?.account_number
                    }
                    await saveTransaction("sucess", parseInt(amount),uid, email,"withdraw", displayName, accountRecipient)
                    showToast("Withdrawal Successful", sucessStyles)
                    redirect("/")
                } catch (error) {
                    showToast(error?.message, errorStyles)
                    
                }
           }
       
    }
    if (!recipient?.account_name) {
          showToast("No Recipient Found!", errorStyles)
    }
    if (!currentUser) {
        showToast("No User Found!", errorStyles)
  }
  if (users?.error) {
        showToast(users?.error?.message, errorStyles)
  }

})

