// DOM Elements
const connectButton = document.getElementById('connectButton');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('connectionStatus');
const balanceAmount = document.getElementById('balanceAmount');
const ethAmountInput = document.getElementById('ethAmount');
const fundButton = document.getElementById('fundButton');
const fundMessage = document.getElementById('fundMessage');
const balanceButton = document.getElementById('balanceButton');
const withdrawButton = document.getElementById('withdrawButton');
const actionMessage = document.getElementById('actionMessage');
const accountDisplay = document.getElementById('accountDisplay'); // Add this line for account display element

// Global variables
let accounts = [];
let isConnected = false;

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

// Initialize the app
async function initApp() {
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
  
  // Check if already connected (accounts already authorized)
  try {
    accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
      handleAccountsChanged(accounts);
    }
  } catch (error) {
    console.error(error);
  }
  
  // Set up event listeners
  connectButton.addEventListener('click', connectToMetaMask);
  fundButton.addEventListener('click', fundContract);
  balanceButton.addEventListener('click', refreshBalance);
  withdrawButton.addEventListener('click', withdrawFunds);
  
  // Set up MetaMask events
  window.ethereum.on('accountsChanged', handleAccountsChanged);
  window.ethereum.on('chainChanged', () => window.location.reload());
  window.ethereum.on('disconnect', handleDisconnect);
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
  withdrawButton.disabled = false;
  
  // Get current balance
  refreshBalance();
  
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
  
  // Clear account display
  if (accountDisplay) {
    accountDisplay.innerText = '';
  }
  
  // Disable buttons
  fundButton.disabled = true;
  withdrawButton.disabled = true;
  
  // Clear localStorage
  localStorage.removeItem('walletConnected');
  localStorage.removeItem('connectedAccount');
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
    
    // Example transaction - replace with your actual contract call
    const transactionParameters = {
      to: '0xc9Cfc643BE5106080c9466eFc11A8DE39a3dB9fa', // Replace with your contract address
      from: accounts[0],
      value: weiAmount.toHexString(),
    };
    
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });
    
    fundMessage.innerText = 'Transaction sent!';
    fundMessage.classList.remove('processing');
    fundMessage.classList.add('success');
    
    // Clear input
    ethAmountInput.value = '';
    
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
    // Example - replace with your actual contract balance query
    const balance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: ['0xc9Cfc643BE5106080c9466eFc11A8DE39a3dB9fa', 'latest'], // Replace with your contract address
    });
    
    const ethBalance = ethers.utils.formatEther(balance);
    balanceAmount.innerText = parseFloat(ethBalance).toFixed(4);
    
    actionMessage.innerText = 'Balance updated';
    actionMessage.classList.remove('processing');
    actionMessage.classList.add('success');
    
    setTimeout(() => {
      actionMessage.innerText = '';
      actionMessage.classList.remove('success');
    }, 2000);
  } catch (error) {
    console.error(error);
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
    // Example - replace with your actual contract withdraw function call
    const transactionParameters = {
      to: '0xc9Cfc643BE5106080c9466eFc11A8DE39a3dB9fa', // Replace with your contract address
      from: accounts[0],
      data: '0x3ccfd60b', // This is the function selector for withdraw()
    };
    
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });
    
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

// Fix for page loads
document.addEventListener('DOMContentLoaded', initApp);

// If the ethers library is not available, load it
if (typeof ethers === 'undefined') {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.umd.min.js';
  script.onload = initApp;
  document.head.appendChild(script);
} else {
  initApp();
}