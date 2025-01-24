import useDAppStore from "../store/store.ts";
import {useEffect} from "react";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const LoginPage: React.FC = () => {
  const { connectWallet, account } = useDAppStore();

  return (
    <div className="container text-center">
      <h2>Welcome to Crowdfunding DApp</h2>
      {account ? (
        <p>Connected as: {account}</p>
      ) : (
        <button
          onClick={() => connectWallet(contractAddress)}
          className="btn btn-secondary"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default LoginPage;
