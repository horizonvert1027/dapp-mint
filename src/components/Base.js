// Import necessary modules and components
import { useContext, useEffect } from "react";
import { ethers } from "ethers";
import { ContextComp } from "../context";
import Wallet from "./Wallet";
import Home from "./Home";
import Mint from "./Mint";
import Merge from "./Merge";
import { toast } from 'react-toastify';
import toastConfig from '../toast.config.js';

// Define the Base component
export function Base() {
  // Destructure values from the context
  const {
    setMintEnabled,
    setbalance,
    setisConnected,
    balance,
    isConnected,
    mintEnabled,
    contract,
    mergeModalVisible,
    mintModalVisible
  } = useContext(ContextComp);

  // Use useEffect to fetch data when the balance.address changes
  useEffect(() => {
    const fetchs = async () => {
      try {
        // Update mintEnabled state based on contract
        setMintEnabled(await contract.isMintEnabled());

        if (balance.address.length > 0) {
          // Fetch token balance and related information
          const count = await contract.balanceOf(balance.address);
          const minted = await contract.tokensMintedByAddress(balance.address);
          let arr = [];
          for (let i = 0; i < count; i++) {
            const id = await contract.tokenOfOwnerByIndex(balance.address, i);
            arr.push(parseInt(id.toString()));
          }
          // Update balance state
          setbalance(prevstate => ({ ...prevstate, count: parseInt(count.toString()), minted: parseInt(minted.toString()), ids: arr }));
        }
      } catch (error) {
        // Handle errors here
      }
    }
    fetchs()
  }, [balance.address])

  // Listen for "Transfer" events from the contract
  contract.on("Transfer", async (to, amount, from) => {
    try {
      // Update mintEnabled state based on contract
      setMintEnabled(await contract.isMintEnabled());

      if (balance.address.length > 0) {
        // Fetch token balance and related information
        const count = await contract.balanceOf(balance.address);
        const minted = await contract.tokensMintedByAddress(balance.address);
        let arr = [];
        for (let i = 0; i < count; i++) {
          const id = await contract.tokenOfOwnerByIndex(balance.address, i);
          arr.push(parseInt(id.toString()));
        }
        // Update balance state
        setbalance(prevstate => ({ ...prevstate, count: parseInt(count.toString()), minted: parseInt(minted.toString()), ids: arr }));
      }
    } catch (error) {
      // Handle errors here
    }
  });

  // Function to connect to Ethereum wallet
  const connect = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const { address, } = await provider.getSigner();
      const eth = ethers.formatEther(await provider.getBalance(address));
      const { chainId } = await provider.getNetwork();
      // Update balance and isConnected states
      setbalance(prevstate => ({ ...prevstate, chainId, address, eth }));
      setisConnected(true);

      if (chainId.toString() !== '5') {
        // Switch to the desired Ethereum network
        await provider.send('wallet_switchEthereumChain', [{ chainId: "0x5" }])
      }
    } else {
      // Show a message if Metamask is not installed
      toast("Please Install Metamask!", toastConfig);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {isConnected && (
          <Wallet />
        )}
        <h1 className="text-2xl font-semibold mb-4">Token Minting App</h1>
        {!isConnected ? (
          <button className="bg-blue-500 px-4 py-2 rounded text-white" onClick={connect}>Connect</button>
        ) : (
          <>
            {!mintEnabled ? (
              <p className="text-red-500">Mint is not enabled</p>
            ) : (
              <Home />
            )}
          </>
        )}
        {mintModalVisible && (
          <Mint />
        )}
        {mergeModalVisible && (
          <Merge />
        )}
      </div>
    </div>
  )
}

export default Base;
