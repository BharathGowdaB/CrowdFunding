import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChainId, ThirdwebProvider, metamaskWallet } from '@thirdweb-dev/react';

import { StateContextProvider } from './context';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = {
  // === Required information for connecting to the network === \\
  chainId: 1337, // Chain ID of the network
  // Array of RPC URLs to use
  rpc: ["http://127.0.0.1:8545"],

  // === Information for adding the network to your wallet (how it will appear for first time users) === \\
  // Information about the chains native currency (i.e. the currency that is used to pay for gas)
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  testnet: false, // Boolean indicating whether the chain is a testnet or mainnet
};

root.render(
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
)