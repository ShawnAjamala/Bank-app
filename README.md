# VaultEx – Online Banking App

VaultEx is a fully functional online banking simulation built with React. It allows users to create accounts, send and receive money, apply for loans, track transactions, and manage their finances – all with persistent localStorage (no backend required).

## Links

- Live Demo: https://bank-app-nine-chi.vercel.app/
- GitHub Repository: https://github.com/ShawnAjamala/Bank-app

## Features

- User Registration and Login – Sign up with name, email, and 4-digit PIN. Demo account: `demo@bank.com` / `1234`.
- Dashboard – View balance, total sent, total received, active loans, recent transactions, and loan reminders.
- Send Money – Transfer funds to other accounts using the recipient's 8-digit account number and your PIN.
- Add Money – Simulate ATM deposits (PIN required).
- Loan Application – Borrow up to $500,000 with 5% flat interest. Choose tenure (3, 6, 12, or 24 months). Repay partially or fully with a progress bar.
- Transaction History – Filter by deposits or withdrawals; amounts are colour‑coded.
- Account Deletion – Permanently remove your account from localStorage after confirmation.
- Responsive Design – Works on desktop, tablet, and mobile (hamburger menu).
- Custom Modals – Styled popups replace browser alerts.

## Demo Credentials

- Email: `demo@bank.com`
- PIN: `1234`

## How to Use

1. **Register** – Fill in your name, email, 4‑digit PIN, and initial deposit (minimum $10). You will be automatically logged in.
2. **Dashboard** – See your account number, balance, statistics, and recent transactions.
3. **Send Money** – Enter the recipient's 8‑digit account number, amount, optional note, and your PIN.
4. **Loans** – Apply for a loan (maximum $500,000). The loan amount is added to your balance immediately. Repay any amount at any time.
5. **Add Money** – Simulate a cash deposit (PIN required).
6. **Transactions** – View your full history and filter by type.
7. **Delete Account** – Click your profile avatar, select "Delete Account", and confirm. All your data is erased permanently.

## Future Enhancements

- Two‑factor authentication
- Dark mode toggle
- Download transaction history as PDF or CSV
- Multi‑currency support
- Backend integration with Node.js and MongoDB
- Real‑time notifications