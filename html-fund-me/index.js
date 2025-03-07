// Import contract address and ABI
import { contractAddress, abi } from "./constants.js";

// DOM Elements - initialize as null and get references later
let connectButton = null;
let statusDot = null;
let statusText = null;
let balanceAmount = null;
let usdBalanceAmount = null;
let ethAmountInput = null;
let ethToUsd = null;
let fundButton = null;
let fundMessage = null;
let balanceButton = null;
let withdrawButton = null;
let actionMessage = null;
let accountDisplay = null;

// Function to get DOM elements - called after DOM is fully loaded
function getDOMElements() {
  connectButton = document.getElementById('connectButton');
  statusDot = document.getElementById('statusDot');
  statusText = document.getElementById('connectionStatus');
  balanceAmount = document.getElementById('balanceAmount');
  usdBalanceAmount = document.getElementById('usdBalanceAmount');
  ethAmountInput = document.getElementById('ethAmount');
  ethToUsd = document.getElementById('ethToUsd');
  fundButton = document.getElementById('fundButton');
  fundMessage = document.getElementById('fundMessage');
  balanceButton = document.getElementById('balanceButton');
  withdrawButton = document.getElementById('withdrawButton');
  actionMessage = document.getElementById('actionMessage');
  accountDisplay = document.getElementById('accountDisplay');
  
  // Log any missing elements to help diagnose issues
  if (!ethToUsd) console.warn("ethToUsd element not found in the DOM");
  if (!usdBalanceAmount) console.warn("usdBalanceAmount element not found in the DOM");
}

// Global variables
let accounts = [];
let isConnected = false;
let provider;
let signer;
let contract;
let ethUsdPrice = 0;

// Check if MetaMask is installed
function checkIfMetaMaskIsInstalled() {
  const { ethereum } = window;
  return Boolean(ethereum && ethereum.isMetaMask);
}

// Format address for display (show first 6 and last 4 characters)
function formatAddress(address) {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Format currency to USD with 2 decimal places
function formatUSD(amount) {
  return parseFloat(amount).toFixed(2);
}

// Initialize the app
async function initApp() {
  console.log("Initializing app...");
  
  // Get DOM elements first
  getDOMElements();
  
  // Check if MetaMask is installed
  const isMetaMaskInstalled = checkIfMetaMaskIsInstalled();
  
  if (!isMetaMaskInstalled) {
    statusText.innerText = 'MetaMask not installed';
    connectButton.innerText = 'Install MetaMask';
    connectButton.addEventListener('click', () => {
      window.open('https://metamask.io/download.html', '_blank');
    });
    return;
  }
  
  // Set up ethers provider
  provider = new ethers.providers.Web3Provider(window.ethereum);
  
  // Check if already connected (accounts already authorized)
  try {
    accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
      console.log("Found existing accounts:", accounts);
      // Initialize signer and contract before calling handleAccountsChanged
      signer = provider.getSigner();
      contract = new ethers.Contract(contractAddress, abi, signer);
      handleAccountsChanged(accounts);
    } else {
      // Even if not connected, fetch ETH/USD price
      fetchEthUsdPrice();
    }
  } catch (error) {
    console.error("Error checking accounts:", error);
    // Still try to fetch ETH/USD price even if there's an error
    fetchEthUsdPrice();
  }
  
  // Set up event listeners
  connectButton.addEventListener('click', connectToMetaMask);
  fundButton.addEventListener('click', fundContract);
  balanceButton.addEventListener('click', refreshBalance);
  if (withdrawButton) {
    withdrawButton.addEventListener('click', withdrawFunds);
  }
  
  // Add listener for ETH amount input to update USD value
  if (ethAmountInput) {
    ethAmountInput.addEventListener('input', updateEthToUsd);
  } else {
    console.warn("Could not attach input event listener - element not found");
  }
  
  // Set up MetaMask events
  window.ethereum.on('accountsChanged', handleAccountsChanged);
  window.ethereum.on('chainChanged', () => window.location.reload());
  window.ethereum.on('disconnect', handleDisconnect);
  
  // Get ETH/USD price initially
  fetchEthUsdPrice();
}

// Connect to MetaMask
async function connectToMetaMask() {
  try {
    accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    handleAccountsChanged(accounts);
  } catch (error) {
    console.error(error);
    if (error.code === 4001) {
      // User rejected the connection
      statusText.innerText = 'Connection rejected';
      setTimeout(() => {
        statusText.innerText = 'Not connected';
      }, 3000);
    } else {
      statusText.innerText = 'Connection error';
    }
  }
}

// Handle accounts changed
function handleAccountsChanged(newAccounts) {
  if (newAccounts.length === 0) {
    // User disconnected
    handleDisconnect();
    return;
  }
  
  accounts = newAccounts;
  isConnected = true;
  
  // Update signer and contract
  signer = provider.getSigner();
  contract = new ethers.Contract(contractAddress, abi, signer);
  
  // Update UI
  statusDot.classList.add('connected');
  statusText.innerText = 'Connected to MetaMask';
  connectButton.innerText = 'Connected';
  
  // Display connected account address
  const currentAccount = accounts[0];
  const formattedAccount = formatAddress(currentAccount);
  if (accountDisplay) {
    accountDisplay.innerText = `Account: ${formattedAccount}`;
    accountDisplay.setAttribute('title', currentAccount); // Full address on hover
  }
  
  // Enable buttons
  fundButton.disabled = false;
  balanceButton.disabled = false;
  if (withdrawButton) {
    withdrawButton.disabled = false;
  }
  
  // Get current balance
  refreshBalance();
  
  // Get current ETH/USD price
  fetchEthUsdPrice();
  
  // Store connection status in localStorage
  localStorage.setItem('walletConnected', 'true');
  localStorage.setItem('connectedAccount', accounts[0]);
}

// Handle disconnect
function handleDisconnect() {
  accounts = [];
  isConnected = false;
  
  // Update UI
  statusDot.classList.remove('connected');
  statusText.innerText = 'Not connected';
  connectButton.innerText = 'Connect Wallet';
  balanceAmount.innerText = '0.00';
  usdBalanceAmount.innerText = '0.00';
  
  // Clear account display
  if (accountDisplay) {
    accountDisplay.innerText = '';
  }
  
  // Disable buttons
  fundButton.disabled = true;
  if (withdrawButton) {
    withdrawButton.disabled = true;
  }
  
  // Clear localStorage
  localStorage.removeItem('walletConnected');
  localStorage.removeItem('connectedAccount');
}

// Fetch ETH/USD price
async function fetchEthUsdPrice() {
  try {
    console.log("Fetching ETH/USD price...");
    
    // First try to get price from API as it's more reliable
    await fetchPriceFromAPI();
    
    // If API failed and contract is available, try contract
    if (ethUsdPrice <= 0 && contract) {
      try {
        console.log("Trying to get price from contract...");
        const priceFeedAddress = await contract.getPriceFeed();
        console.log("Price feed address:", priceFeedAddress);
        
        const priceFeedAbi = [
          {
            inputs: [],
            name: "latestRoundData",
            outputs: [
              { internalType: "uint80", name: "roundId", type: "uint80" },
              { internalType: "int256", name: "answer", type: "int256" },
              { internalType: "uint256", name: "startedAt", type: "uint256" },
              { internalType: "uint256", name: "updatedAt", type: "uint256" },
              { internalType: "uint80", name: "answeredInRound", type: "uint80" }
            ],
            stateMutability: "view",
            type: "function"
          }
        ];
        
        const priceFeed = new ethers.Contract(priceFeedAddress, priceFeedAbi, provider);
        const roundData = await priceFeed.latestRoundData();
        
        // Price feeds typically return price with 8 decimals
        ethUsdPrice = parseFloat(roundData.answer.toString()) / 100000000;
        console.log("ETH/USD price from price feed:", ethUsdPrice);
      } catch (error) {
        console.error("Error getting price from contract:", error);
      }
    }
    
    // If both methods failed, use fallback value
    if (ethUsdPrice <= 0) {
      ethUsdPrice = 4500; // Fallback value
      console.log("Using fallback ETH/USD price:", ethUsdPrice);
    }
    
    console.log("Final ETH/USD price:", ethUsdPrice);
    
    // Check if the DOM is ready before trying to update UI elements
    try {
      // Update any existing ETH amounts to show USD value - with safeguards
      if (typeof updateEthToUsd === 'function') {
        updateEthToUsd();
      }
      
      if (typeof updateUsdBalance === 'function') {
        updateUsdBalance();
      }
    } catch (uiError) {
      console.error("Error updating UI with price:", uiError);
    }
  } catch (error) {
    console.error("Error fetching ETH/USD price:", error);
    // Use fallback value even if everything fails
    ethUsdPrice = 4500;
    console.log("Using fallback ETH/USD price after error:", ethUsdPrice);
    
    // Still try to update UI, but with safeguards
    try {
      if (typeof updateEthToUsd === 'function') {
        updateEthToUsd();
      }
      
      if (typeof updateUsdBalance === 'function') {
        updateUsdBalance();
      }
    } catch (uiError) {
      console.error("Error updating UI with fallback price:", uiError);
    }
  }
}

// Fetch price from a public API as fallback
async function fetchPriceFromAPI() {
  try {
    console.log("Fetching price from API...");
    // Using CoinGecko API
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await response.json();
    
    if (data && data.ethereum && data.ethereum.usd) {
      ethUsdPrice = data.ethereum.usd;
      console.log("ETH/USD price from API:", ethUsdPrice);
      return true;
    } else {
      console.error("Invalid response from price API:", data);
      return false;
    }
  } catch (error) {
    console.error("Error fetching price from API:", error);
    return false;
  }
}

// Update ETH to USD conversion display when user inputs amount
function updateEthToUsd() {
  // Check if ethToUsd element exists before trying to update it
  if (!ethToUsd) {
    console.log("ETH to USD display element not found");
    return;
  }
  
  // Check if ethAmountInput exists
  const ethValue = ethAmountInput ? (parseFloat(ethAmountInput.value) || 0) : 0;
  const usdValue = ethValue * ethUsdPrice;
  ethToUsd.innerText = `≈ ${formatUSD(usdValue)}`;
}

// Update USD balance display
function updateUsdBalance() {
  if (!usdBalanceAmount) {
    console.error("USD Balance element not found");
    return;
  }
  
  const ethValue = parseFloat(balanceAmount.innerText) || 0;
  const usdValue = ethValue * ethUsdPrice;
  console.log(`Updating USD balance: ${ethValue} ETH × ${ethUsdPrice} = ${usdValue}`);
  usdBalanceAmount.innerText = formatUSD(usdValue);
}

// Fund contract
async function fundContract() {
  if (!isConnected) {
    fundMessage.innerText = 'Please connect your wallet first';
    fundMessage.classList.add('error');
    setTimeout(() => {
      fundMessage.innerText = '';
      fundMessage.classList.remove('error');
    }, 3000);
    return;
  }
  
  const ethAmount = ethAmountInput.value;
  if (!ethAmount || parseFloat(ethAmount) <= 0) {
    fundMessage.innerText = 'Please enter a valid amount';
    fundMessage.classList.add('error');
    setTimeout(() => {
      fundMessage.innerText = '';
      fundMessage.classList.remove('error');
    }, 3000);
    return;
  }
  
  fundMessage.innerText = 'Processing...';
  fundMessage.classList.add('processing');
  
  try {
    const weiAmount = ethers.utils.parseEther(ethAmount);
    
    // Use the contract to send funds
    const tx = await contract.fund({ value: weiAmount });
    await tx.wait(1); // Wait for 1 confirmation
    
    fundMessage.innerText = 'Transaction sent!';
    fundMessage.classList.remove('processing');
    fundMessage.classList.add('success');
    
    // Clear input
    ethAmountInput.value = '';
    ethToUsd.innerText = '≈ $0.00';
    
    // Refresh balance after a short delay
    setTimeout(refreshBalance, 2000);
    
    setTimeout(() => {
      fundMessage.innerText = '';
      fundMessage.classList.remove('success');
    }, 5000);
  } catch (error) {
    console.error(error);
    fundMessage.innerText = 'Transaction failed';
    fundMessage.classList.remove('processing');
    fundMessage.classList.add('error');
    
    setTimeout(() => {
      fundMessage.innerText = '';
      fundMessage.classList.remove('error');
    }, 3000);
  }
}

// Refresh balance
async function refreshBalance() {
  if (!isConnected) {
    actionMessage.innerText = 'Please connect your wallet first';
    actionMessage.classList.add('error');
    setTimeout(() => {
      actionMessage.innerText = '';
      actionMessage.classList.remove('error');
    }, 3000);
    return;
  }
  
  actionMessage.innerText = 'Refreshing balance...';
  actionMessage.classList.add('processing');
  
  try {
    // Ensure we have a valid ETH/USD price
    if (ethUsdPrice <= 0) {
      console.log("No valid ETH/USD price, fetching...");
      await fetchEthUsdPrice();
    }
    
    // Get balance using ethers provider
    const balance = await provider.getBalance(contractAddress);
    const ethBalance = ethers.utils.formatEther(balance);
    console.log(`Contract balance: ${ethBalance} ETH`);
    balanceAmount.innerText = parseFloat(ethBalance).toFixed(4);
    
    // Update USD balance
    updateUsdBalance();
    
    actionMessage.innerText = 'Balance updated';
    actionMessage.classList.remove('processing');
    actionMessage.classList.add('success');
    
    setTimeout(() => {
      actionMessage.innerText = '';
      actionMessage.classList.remove('success');
    }, 2000);
  } catch (error) {
    console.error("Error refreshing balance:", error);
    actionMessage.innerText = 'Failed to get balance';
    actionMessage.classList.remove('processing');
    actionMessage.classList.add('error');
    
    setTimeout(() => {
      actionMessage.innerText = '';
      actionMessage.classList.remove('error');
    }, 3000);
  }
}

// Withdraw funds
async function withdrawFunds() {
  if (!isConnected) {
    actionMessage.innerText = 'Please connect your wallet first';
    actionMessage.classList.add('error');
    setTimeout(() => {
      actionMessage.innerText = '';
      actionMessage.classList.remove('error');
    }, 3000);
    return;
  }
  
  actionMessage.innerText = 'Processing withdrawal...';
  actionMessage.classList.add('processing');
  
  try {
    // Use the contract to withdraw funds
    const tx = await contract.withdraw();
    await tx.wait(1); // Wait for 1 confirmation
    
    actionMessage.innerText = 'Withdrawal transaction sent!';
    actionMessage.classList.remove('processing');
    actionMessage.classList.add('success');
    
    // Refresh balance after a short delay
    setTimeout(refreshBalance, 2000);
    
    setTimeout(() => {
      actionMessage.innerText = '';
      actionMessage.classList.remove('success');
    }, 5000);
  } catch (error) {
    console.error(error);
    actionMessage.innerText = 'Withdrawal failed';
    actionMessage.classList.remove('processing');
    actionMessage.classList.add('error');
    
    setTimeout(() => {
      actionMessage.innerText = '';
      actionMessage.classList.remove('error');
    }, 3000);
  }
}

// Fix for page loads - wait for DOM to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // DOM already loaded, can initialize immediately
  setTimeout(initApp, 100); // Small delay to ensure all scripts are processed
}

// If the ethers library is not available, load it
if (typeof ethers === 'undefined') {
  console.log("Ethers library not found, loading from CDN...");
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.umd.min.js';
  script.onload = () => {
    console.log("Ethers library loaded");
    setTimeout(initApp, 100); // Small delay to ensure library is properly initialized
  };
  document.head.appendChild(script);
}