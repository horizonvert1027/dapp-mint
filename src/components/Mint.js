// Import necessary modules and components
import { ethers } from "ethers";
import { useContext } from "react";
import { ContextComp } from "../context";
import {  toast } from 'react-toastify';
import abi from '../abi.json';

// Define the Mint component
export function Mint() {
  // Destructure values from the context
  const {
    balance,
    setMintModalVisible,
    maxMintable,
    isLoading,
    setisLoading,
    unitPrice,
    quantity,
    setQuantity
  } = useContext(ContextComp);

  // Function to handle the minting process
  const handleMint = async () => {
    try {
      setisLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(balance.address);
      // Create a contract instance
      const contract = new ethers.Contract("0xcD68E1C238F939f1643D6EC289eb6FB25668D413", abi, signer);
      // Send a transaction to mint tokens
      const tx = await contract.mint(quantity, { value: ethers.parseEther((quantity * unitPrice).toString()) });
      setMintModalVisible(false);
      setisLoading(false);
      // Show toast message based on transaction status
      toast.promise(
        tx.wait(),
        {
          pending: `Transaction sent: ${tx.hash}`,
          success: `Transaction confirmed: ${tx.hash}`,
          error: `Transaction failed: ${tx.hash}`
        }
      )
    } catch (error) {
      setisLoading(false);
      // Show an error toast message
      toast.error(`Transaction failed: ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Mint Token</h2>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            {/* Buttons to adjust the quantity */}
            <button
              onClick={() => setQuantity(quantity - 1)}
              disabled={quantity === 1}
              className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
            >
              -
            </button>
            <button
              onClick={() => setQuantity(quantity + 1)}
              disabled={quantity === maxMintable - balance.minted}
              className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 disabled:opacity-50"
            >
              +
            </button>
          </div>
        </div>
        <p className="font-semibold text-lg my-3">
          Balance: {balance.eth}
        </p>
        <p className="font-semibold text-lg my-3">
          Mintable Tokens: {maxMintable - balance.minted}
        </p>
        <p className="font-semibold text-lg my-3">
          Quantity: {quantity}
        </p>
        <p className="font-semibold text-lg">
          Total Price: {quantity * unitPrice} ETH
        </p>
        {/* Show an error message if there's insufficient balance */}
        {parseFloat(balance.eth) < quantity * unitPrice && <p className="text-red-600 font-semibold text-lg">Insufficient balance</p>}
        <button
          onClick={handleMint}
          className="mt-4 bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 disabled:opacity-50"
          // Disable the button if there's insufficient balance or if a transaction is in progress
          disabled={parseFloat(balance.eth) < quantity * unitPrice || isLoading}
        >
          {isLoading ? '...' : 'Mint now'}
        </button>
        <button
          onClick={() => setMintModalVisible(false)}
          className="mt-4 mx-3 bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default Mint;
