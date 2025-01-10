import { getUserInDb, showToast } from "./auth-actions.js"
import { errorStyles } from "./toastify.js"

const accountInfoDOM =  document.querySelector(".account-info")

document.querySelector(".vector-form-container").addEventListener("submit", async (e) => {
    e.preventDefault()
    const { vectorNumber } = Object.fromEntries(new FormData(e.currentTarget))
    if (vectorNumber.length < 10) {
        showToast("Account Number too short", errorStyles)
    }
    else{
        const users = await getUserInDb() // 1399620272
        const userInfo = users.filter(user=>user[1]?.accountNumber === parseInt(vectorNumber))
        if (userInfo.length > 0) {
            const res = userInfo.map(user => user[1])    
           accountInfoDOM.innerHTML = `
                <h2>${res[0]?.name}</h2>
                <p>${res[0]?.accountNumber}</p>
            `
        }else{
            accountInfoDOM.innerHTML = `
            <h2>No result Found, Please enter recipient's account number </h2>
        `
        }
    }
    
  })