// Import necessary modules and components
import { ethers } from "ethers";
import { useContext } from "react";
import { ContextComp } from "../context";
import {  toast } from 'react-toastify';
import abi from '../abi.json';

// Define the Merge component
export function Merge() {
  // Destructure values from the context
  const {
    balance,
    setMergeModalVisible,
    selectedToken1,
    selectedToken2,
    setSelectedToken1,
    setSelectedToken2,
    isLoading,
    setisLoading,
    maxMintable
  } = useContext(ContextComp);

  // Function to handle the merge process
  const handleMerge = async () => {
    if (selectedToken1 && selectedToken2) {
      try {
        setisLoading(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner(balance.address);
        // Create a contract instance
        const contract = new ethers.Contract("0xcD68E1C238F939f1643D6EC289eb6FB25668D413", abi, signer);
        // Send a transaction to merge tokens
        const tx = await contract.merge(selectedToken1, selectedToken2);
        setMergeModalVisible(false);
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
    } else {
      // Show a message indicating both tokens must be selected
      // You can add a visual notification or alert here
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Merge Tokens</h2>
        <div className="mb-4">
          <label htmlFor="token1" className="block text-sm font-medium text-gray-700">
            Select Token 1
          </label>
          <select
            id="token1"
            name="token1"
            className="mt-1 p-2 border border-gray-300 rounded w-full"
            onChange={(e) => setSelectedToken1(e.target.value)}
          >
            <option value="">Select Token</option>
            {/* Map through available token IDs */}
            {balance.ids.map((token) => (
              <option key={token} value={token}>
                Token ID: {token}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="token2" className="block text-sm font-medium text-gray-700">
            Select Token 2
          </label>
          <select
            id="token2"
            name="token2"
            className="mt-1 p-2 border border-gray-300 rounded w-full"
            onChange={(e) => setSelectedToken2(e.target.value)}
            disabled={!selectedToken1}
          >
            <option value="">Select Token</option>
            {/* Filter and map through available token IDs for the second selection */}
            {balance.ids
              .filter((token) => token !== parseInt(selectedToken1))
              .map((token) => (
                <option key={token} value={token}>
                  Token ID: {token}
                </option>
              ))}
          </select>
        </div>
        <button
          onClick={handleMerge}
          // Disable the button based on various conditions
          disabled={
            !selectedToken1 ||
            !selectedToken2 ||
            balance.ids.length >= maxMintable ||
            isLoading
          }
          className="mt-4 bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 disabled:opacity-50"
        >
          {isLoading ? '...' : 'Merge'}
        </button>
        <button
          onClick={() => setMergeModalVisible(false)}
          className="mt-4 mx-3 bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default Merge;
