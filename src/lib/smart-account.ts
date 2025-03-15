/**
 * Create a smart account using the connected wallet as the owner
 * @param provider The Ethereum provider from the connected wallet
 * @returns The smart account address
 */
export async function createSmartAccount(provider: any) {
  try {
    // Get the connected account
    const accounts = await provider.request({ method: 'eth_accounts' });
    const ownerAddress = accounts[0];
    
    // In a real implementation, we would:
    // 1. Use the Base Smart Account Factory to create a new smart account
    // 2. Register the owner address as the owner of the smart account
    // 3. Return the smart account address and client
    
    // For now, we'll simulate creating a smart account by deriving an address
    // from the owner address
    const smartAccountAddress = `0x${ownerAddress.slice(2, 12)}SmartWallet${ownerAddress.slice(-8)}`;
    
    // Log the creation for debugging
    console.log('Created smart account:', smartAccountAddress, 'with owner:', ownerAddress);
    
    return {
      address: smartAccountAddress,
      owner: ownerAddress
    };
  } catch (error) {
    console.error('Error creating smart account:', error);
    throw error;
  }
}

/**
 * Send a transaction using the smart account
 * @param provider The Ethereum provider
 * @param smartAccountAddress The smart account address
 * @param to The recipient address
 * @param value The amount to send in wei
 * @param data The transaction data
 * @returns The transaction hash
 */
export async function sendTransaction(
  provider: any,
  smartAccountAddress: string,
  to: string,
  value: string,
  data: string = '0x'
) {
  try {
    // In a real implementation, we would:
    // 1. Create a user operation with the transaction details
    // 2. Sign the user operation with the owner's wallet
    // 3. Submit the user operation to the bundler
    // 4. Return the transaction hash
    
    // For now, we'll simulate sending a transaction
    const txHash = `0x${Math.random().toString(16).slice(2)}`;
    
    console.log('Sent transaction from smart account:', smartAccountAddress, 'to:', to, 'value:', value);
    
    return txHash;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
}
