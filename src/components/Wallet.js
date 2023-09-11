// Import necessary modules and components
import { useContext } from "react";
import { ContextComp } from "../context";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import toastConfig from '../toast.config.js';

// Define the Wallet component
export function Wallet() {
  // Destructure values from the context
  const { balance } = useContext(ContextComp);

  return (
    <div className="absolute top-0 right-0 m-4 bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="text-white">
        <p className="text-lg font-bold mb-2">Chain ID: {balance.chainId.toString()}</p>
        <div className="flex items-center">
          <p className="inline mr-2">
            Account address: {balance.address.substring(0, 6)}...
            {balance.address.substring(balance.address.length - 4)}
          </p>
          {/* Copy account address to clipboard on click */}
          <CopyToClipboard text={balance.address} onCopy={() => toast('Copied!', toastConfig)}>
            <FontAwesomeIcon icon={faCopy} className="text-blue-500 hover:text-blue-700 cursor-pointer" />
          </CopyToClipboard>
        </div>
      </div>
    </div>
  )
}

export default Wallet;
