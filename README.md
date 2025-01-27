## Frontend Repository

### Features
- Built with **React** and **Vite**.
- Enables users to browse projects, contribute, and manage tokens.
- Supports wallet integration (e.g., MetaMask).
- Communicates with the backend via REST APIs.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Mkznd/blockchain_frontend
   cd blockchain_frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

### Environment Variables
Create a `.env` file with the following variables:
```plaintext
VITE_API_URL=backend-api-url
VITE_CHAIN_ID=blockchain-network-id
VITE_CONTRACT_ADDRESS=smart-contract-address
```

---

## Backend Repository

### Features
- Blockchain-powered backend with smart contract (ERC20) integration.
- Manages project data, contributions, and token distributions.
- Dockerized for easy deployment.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-backend-repo.git
   cd your-backend-repo
   ```
2. Build and run with Docker:
   ```bash
   docker build -t crowdfunding-backend .
   docker run -p 4000:4000 crowdfunding-backend
   ```

### Environment Variables
Create a `.env` file with the following variables:
```plaintext
PORT=4000
MONGO_URI=your-mongodb-connection-string
CHAIN_ID=blockchain-network-id
CONTRACT_ADDRESS=smart-contract-address
PRIVATE_KEY=private-key-for-contract-deployment
```

---

## Contributing
1. Fork the relevant repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed explanation.

---

## License
This project is licensed under the MIT License. See the `LICENSE` file in each repository for details.
``` 

This `README.md` covers the essentials for both repositories, offering concise instructions and guidelines for each. Let me know if you'd like to expand any section!
