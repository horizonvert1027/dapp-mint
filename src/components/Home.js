// Import necessary modules and components
import { useContext } from "react";
import { ContextComp } from "../context";

// Define the Home component
export function Home() {
  // Destructure values from the context
  const { balance, setMergeModalVisible, setMintModalVisible, maxMintable } = useContext(ContextComp);

  return (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Your Tokens</h2>
        <ul>
          {/* Map through the token IDs and display them */}
          {balance.ids.map((token) => (
            <li key={token}>
              Token ID: {token}
            </li>
          ))}
        </ul>
      </div>
      {/* Button to open the Mint Token modal */}
      <button
        onClick={() => setMintModalVisible(true)}
        // Disable the button if the user has minted the maximum allowed tokens
        disabled={balance.ids.length >= maxMintable}
        className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 disabled:opacity-50"
      >
        Mint Token
      </button>
      {/* Button to open the Merge modal */}
      <button
        onClick={() => setMergeModalVisible(true)}
        // Disable the button if the user cannot merge more tokens
        disabled={
          balance.ids.length >= maxMintable
        }
        className="mt-4 mx-4 bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 disabled:opacity-50"
      >
        Merge
      </button>
    </>
  )
}

export default Home;
