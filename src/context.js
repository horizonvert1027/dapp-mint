// Import necessary modules
import { createContext, useState } from 'react';
import { ethers } from 'ethers';
import abi from './abi.json';

// Create a context to hold shared state
export const ContextComp = createContext();

// Define the Context component
export const Context = (props) => {
  // Initialize state variables
  const [mintEnabled, setMintEnabled] = useState(true);
  const [mintModalVisible, setMintModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const unitPrice = 0.001;
  const maxMintable = 10;
  const [mergeModalVisible, setMergeModalVisible] = useState(false);
  const [selectedToken1, setSelectedToken1] = useState(null);
  const [selectedToken2, setSelectedToken2] = useState(null);

  // Create an ethers provider for the Alchemy API on the Goerli network
  const provider = new ethers.AlchemyProvider("goerli", "o-gr7Wuksl5USFuWNxKRayuC1Mhqniel");

  // Create an ethers contract instance
  const contract = new ethers.Contract("0xcD68E1C238F939f1643D6EC289eb6FB25668D413", abi, provider);

  // Initialize more state variables
  const [isConnected, setisConnected] = useState(false);
  const [balance, setbalance] = useState({ address: "", chainId: "", eth: "", count: 0, minted: 0, ids: [] });
  const [isLoading, setisLoading] = useState(false);

  return (
    // Provide the shared state to children components through ContextComp.Provider
    <ContextComp.Provider value={{
      mintEnabled,
      setMintEnabled,
      mintModalVisible,
      setMintModalVisible,
      quantity,
      setQuantity,
      unitPrice,
      maxMintable,
      mergeModalVisible,
      setMergeModalVisible,
      selectedToken1,
      setSelectedToken1,
      selectedToken2,
      setSelectedToken2,
      provider,
      contract,
      isConnected,
      setisConnected,
      balance,
      setbalance,
      isLoading,
      setisLoading,
    }}>
      {props.children}
    </ContextComp.Provider>
  );
};

export default Context;
