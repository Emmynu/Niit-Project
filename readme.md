# VectorPay

VectorPay is a web application designed to replicate the core functionalities of mobile money platforms like OPay. Developed as a final project for my NIIT (National Institute of Information Technology) program, VectorPay provides users with a convenient way to manage their finances, including deposits, transfers, and withdrawals.

## Features

*   **Deposits:** Users can deposit funds using various methods (card payment or bank transfer) via integration with the Korapay payment gateway.
*   **Transfers:** Users can seamlessly transfer funds to other VectorPay accounts.
*   **Withdrawals (Partial Implementation):** While full withdrawal functionality is limited in test mode, users can input their bank account details, which are then verified. A simulated withdrawal process updates the user's balance accordingly, mimicking successful or failed withdrawal scenarios.
*   **User Authentication:** Secure user authentication using Firebase Auth, supporting both Google sign-in and email/password credentials.
*   **Profile Page:** Users have access to a profile page to manage their account information.
*   **Real-time Database:** Utilizes Firebase Realtime Database for storing and retrieving user data and transaction history.
*   **User Notifications:** Uses Toastify for user notifications and feedback.

## Technologies Used

*   HTML
*   CSS
*   JavaScript (Vanilla JS)
*   Firebase Authentication
*   Firebase Realtime Database
*   Korapay Payment Gateway
*   Toastify

## Installation/Setup

This project is a client-side web application. To run it:

1.  Clone the repository: `git clone https://github.com/Emmynu/Niit-Project.git`
2.  Open the `index.html` file in your web browser.

**Note:** Since this is a client-side application, there is no server-side setup required. To use the payment and withdrawal functionalities you will need to set up a firebase project and configure the app to use it. You will also need to get a test public and secret key from korapay to test the deposit functionality.

## Usage

*   **Authentication:** Use the provided login/signup options (Google or email/password) to access your account.
*   **Deposits:** Navigate to the deposit section and follow the instructions to deposit funds using your preferred method.
*   **Transfers:** Go to the transfer section, enter the recipient's VectorPay account details, and the amount to transfer.
*   **Withdrawals:** Go to the withdrawal section, enter your bank account details and amount to withdraw. The application will simulate the withdrawal process.
*   **Profile:** Access your profile page to manage your account information.

## Known Issues/Limitations

*   **Client-Side Processing:** The application relies heavily on client-side processing due to the use of vanilla JS without a backend server. This can lead to slower performance, especially with large amounts of data.
*   **Security Vulnerabilities:** The absence of server-side validation and JWT (JSON Web Token) authentication makes the application more vulnerable to security risks. Sensitive data is not securely handled.
*   **Withdrawal Simulation:** The withdrawal feature is only partially implemented for testing purposes due to the test mode limitations of the Korapay API. Real withdrawals are not possible in the current version.
*   **No Caching:** No caching mechanisms are implemented, which can impact performance.

## Future Enhancements (Version 2)

*   **Backend Implementation:** Implement a backend server (e.g., using Nextjs, MongoDB, prisma) to handle data processing, authentication, and API requests. This will significantly improve performance and security.
*   **JWT Authentication:** Implement JWT authentication to secure API endpoints and protect user data.
*   **Full Withdrawal Functionality:** Implement full withdrawal functionality once the application is in live mode with Korapay/Paystack.
*   **Caching:** Implement caching mechanisms to improve performance and reduce server load (if a backend is implemented).
*   **Improved UI/UX:** Enhance the user interface and user experience based on user feedback and best practices.
*   **Improved error handling:** Implement better error handling and user feedback.

## Credits

*   Korapay for the payment gateway.
*   Firebase for authentication and database services.
*   Toastify for user notifications.

## Author

Adelaja Similoluwa Emmanuel