export const sideBarComponent = ` 
     <aside class="side-bar-lg">
           <section class="logo-container">
                <img src="../images/logo.png" alt="logo" class="logo">
                <h1 class="logo-label">VectorPay</h1>
           </section>
           <section style="padding: 5px;">
             <article class="links-container">
                <section >
                    <img src="/images/wallet.png" alt="">
                    <a href="/">Wallet</a>
                </section>
                <section>
                    <img src="/images/transfer.png" alt="">
                    <a href="/dashboard/transfer.html">Transfer</a>
                </section>
                <section>
                    <img src="/images/withdraw.png" alt="">
                    <a href="/dashboard/withdraw.html">Withdraw</a>
                </section>
                <section>
                    <img src="/images/settings.png" alt="">
                    <a href="/dashboard/settings.html">Settings</a>
                </section>
             </article>
           </section>
        </aside>

        <aside class="side-bar-container ">
        <section>
            <section class="close-btn">
                <button>&#215;</button>
            </section>
           <div style="padding: 4rem 2rem;">
                <section class="logo-container-2" style="padding: 1;">
                    <img src="../images/logo.png" alt="logo" class="logo">
                    <h1 class="logo-label">VectorPay</h1>
                </section>
    
                <section >
                    <article class="links-container">
                    <section >
                        <img src="/images/wallet.png" alt="">
                        <a href="/">Wallet</a>
                    </section>
                    <section>
                        <img src="/images/transfer.png" alt="">
                        <a href="/dashboard/transfer.html">Transfer</a>
                    </section>
                    <section>
                        <img src="/images/withdraw.png" alt="">
                        <a href="/dashboard/withdraw.html">Withdraw</a>
                    </section>
                    <section>
                        <img src="/images/settings.png" alt="">
                        <a href="/dashboard/settings.html">Settings</a>
                    </section>
                    </article>
                </section>
           </div>
        </section>
    </aside>
 `
export const dashboardNav = `
  <!-- for large screens -->
            <nav class="dashboard-nav">
                <h2>Dashboard</h2>
                <section class="search-container">
                    <input type="search" name="search" id="search" placeholder="Search here...">
                    <img src="https://img.icons8.com/?size=100&id=59878&format=png&color=000000" alt="" >
                </section>
                <section class="user-container">
                </section>
                <button id="logout">LogOut</button>
            </nav>
            <!-- for small screens -->
            <nav class="dashboard-nav-sm">
                <!-- nav bar -->
                 <section class="nav-bar-container">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                 </section>
                <section class="logo-container">
                    <img src="../images/logo.png" alt="logo" class="logo">
                    <h1 class="logo-label">VectorPay</h1>
                </section>
                <button id="logout">LogOut</button>
            </nav>
 `