// The simplest MetaMask connector

// Function to connect to MetaMask
async function connectMetaMask() {
    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask is not installed! Please install MetaMask to use this feature.');
      return false;
    }
    
    try {
      // Request access to the user's accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Get the connected account
      const account = accounts[0];
      console.log('Connected to MetaMask!');
      console.log('Your account is:', account);
      
      return account;
    } catch (error) {
      console.error('Failed to connect to MetaMask:', error);
      return false;
    }
  }
  
  // Function to get account balance
  async function getAccountBalance(account) {
    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [account, 'latest']
      });
      
      // Convert balance from wei (hex) to ether
      const etherBalance = parseInt(balance, 16) / 1e18;
      return etherBalance;
    } catch (error) {
      console.error('Error getting balance:', error);
      return null;
    }
  }
  
  // Function to send a transaction
  async function sendTransaction(toAddress, amountInEther) {
    try {
      // Get the current account
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const fromAddress = accounts[0];
      
      // Convert ether to wei (1 ether = 10^18 wei)
      const amountInWei = '0x' + (BigInt(Math.round(amountInEther * 1e18))).toString(16);
      
      // Create the transaction object
      const transactionParameters = {
        from: fromAddress,
        to: toAddress,
        value: amountInWei
      };
      
      // Send the transaction
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters]
      });
      
      return txHash;
    } catch (error) {
      console.error('Error sending transaction:', error);
      return null;
    }
  }
  
  // Basic event listeners for account and network changes
  function setupEventListeners() {
    if (typeof window.ethereum !== 'undefined') {
      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        console.log('Account changed to:', accounts[0]);
      });
      
      // Listen for network changes
      window.ethereum.on('chainChanged', (chainId) => {
        console.log('Network changed to:', chainId);
        // MetaMask recommends reloading the page on chain change
        window.location.reload();
      });
    }
  }
  
  // Call setup when the script loads
  setupEventListeners();