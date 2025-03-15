import Arweave from 'arweave';
import { toast } from 'sonner';
import { ethers } from 'ethers';

// Initialize Arweave
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
  timeout: 20000,
});

// Local storage key for Arweave wallet
const ARWEAVE_WALLET_KEY = 'tuma-arweave-wallet';

export interface FileMetadata {
  name: string;
  type: string;
  size: number;
  sender: string;
  recipient: string;
  timestamp: number;
  description?: string;
}

export interface StoredFile {
  id: string;
  metadata: FileMetadata;
}

class ArweaveService {
  private wallet: any = null;

  constructor() {
    // Try to load wallet from local storage on initialization
    this.loadWalletFromStorage();
  }

  /**
   * Load wallet from local storage if available
   */
  private loadWalletFromStorage(): void {
    try {
      const encryptedWallet = localStorage.getItem(ARWEAVE_WALLET_KEY);
      if (encryptedWallet) {
        // In a real app, we would decrypt this with a key derived from the user's Ethereum wallet
        // For simplicity, we're just parsing it directly here
        this.wallet = JSON.parse(encryptedWallet);
        console.log('Arweave wallet loaded from storage');
      }
    } catch (error) {
      console.error('Error loading Arweave wallet from storage:', error);
      // Silently fail - we'll generate a new wallet when needed
    }
  }

  /**
   * Save wallet to local storage
   */
  private saveWalletToStorage(): void {
    try {
      if (this.wallet) {
        // In a real app, we would encrypt this with a key derived from the user's Ethereum wallet
        // For simplicity, we're just stringifying it directly here
        localStorage.setItem(ARWEAVE_WALLET_KEY, JSON.stringify(this.wallet));
      }
    } catch (error) {
      console.error('Error saving Arweave wallet to storage:', error);
      // Silently fail - not critical
    }
  }

  /**
   * Set the wallet key for Arweave transactions
   * @param jwk The JWK wallet object
   */
  setWallet(jwk: any) {
    this.wallet = jwk;
    this.saveWalletToStorage();
  }

  /**
   * Check if wallet is connected
   */
  isWalletConnected(): boolean {
    return this.wallet !== null;
  }

  /**
   * Generate a new wallet key
   * @param ethAddress Optional Ethereum address to derive the wallet from
   * @returns The JWK wallet object
   */
  async generateWallet(ethAddress?: string) {
    try {
      let key;
      
      if (ethAddress) {
        // Derive a deterministic key from the Ethereum address
        // This is a simplified example - in a real app, you would use a more secure method
        const seed = ethers.id(ethAddress + '-arweave-key');
        // Use the seed to generate a deterministic key
        // For simplicity, we're just using a random key here
        key = await arweave.wallets.generate();
      } else {
        // Generate a random key if no Ethereum address is provided
        key = await arweave.wallets.generate();
      }
      
      this.wallet = key;
      this.saveWalletToStorage();
      return key;
    } catch (error) {
      console.error('Error generating wallet:', error);
      // Don't show error to user - silent failure
      throw error;
    }
  }

  /**
   * Ensure wallet is available, generating one if needed
   * @param ethAddress Optional Ethereum address to derive the wallet from
   */
  async ensureWallet(ethAddress?: string): Promise<void> {
    if (!this.isWalletConnected()) {
      await this.generateWallet(ethAddress);
    }
  }

  /**
   * Upload a file to Arweave
   * @param file The file to upload
   * @param metadata File metadata
   * @param ethAddress Optional Ethereum address to derive the wallet from
   * @returns The transaction ID
   */
  async uploadFile(file: File, metadata: FileMetadata, ethAddress?: string): Promise<string> {
    // Ensure wallet is available
    await this.ensureWallet(ethAddress);

    try {
      // Read file as array buffer
      const fileBuffer = await file.arrayBuffer();
      const fileData = new Uint8Array(fileBuffer);

      // Create transaction
      const transaction = await arweave.createTransaction({ data: fileData }, this.wallet);

      // Add tags for metadata
      transaction.addTag('Content-Type', file.type);
      transaction.addTag('App-Name', 'TUMA-Document-Exchange');
      transaction.addTag('Document-Name', metadata.name);
      transaction.addTag('Document-Type', metadata.type);
      transaction.addTag('Document-Size', metadata.size.toString());
      transaction.addTag('Sender', metadata.sender);
      transaction.addTag('Recipient', metadata.recipient);
      transaction.addTag('Timestamp', metadata.timestamp.toString());
      
      if (metadata.description) {
        transaction.addTag('Description', metadata.description);
      }

      // Sign transaction
      await arweave.transactions.sign(transaction, this.wallet);

      // Submit transaction
      const response = await arweave.transactions.post(transaction);
      
      if (response.status === 200 || response.status === 202) {
        return transaction.id;
      } else {
        throw new Error(`Transaction failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document to Arweave');
      throw error;
    }
  }

  /**
   * Get a file from Arweave
   * @param id The transaction ID
   * @returns The file data and metadata
   */
  async getFile(id: string): Promise<{ data: Uint8Array; metadata: FileMetadata }> {
    try {
      // Get transaction data
      const data = await arweave.transactions.getData(id, { decode: true }) as Uint8Array;
      
      // Get transaction tags
      const tags = await this.getTransactionTags(id);
      
      // Extract metadata from tags
      const metadata: FileMetadata = {
        name: tags['Document-Name'] || 'Unknown',
        type: tags['Document-Type'] || 'Unknown',
        size: parseInt(tags['Document-Size'] || '0'),
        sender: tags['Sender'] || 'Unknown',
        recipient: tags['Recipient'] || 'Unknown',
        timestamp: parseInt(tags['Timestamp'] || Date.now().toString()),
        description: tags['Description'],
      };

      return { data, metadata };
    } catch (error) {
      console.error('Error getting document:', error);
      toast.error('Failed to retrieve document from Arweave');
      throw error;
    }
  }

  /**
   * Get transaction tags
   * @param id The transaction ID
   * @returns Object with tag names and values
   */
  private async getTransactionTags(id: string): Promise<Record<string, string>> {
    const transaction = await arweave.transactions.get(id);
    const tags: Record<string, string> = {};

    if (transaction.tags) {
      transaction.tags.forEach((tag: any) => {
        const key = tag.get('name', { decode: true, string: true });
        const value = tag.get('value', { decode: true, string: true });
        tags[key] = value;
      });
    }

    return tags;
  }

  /**
   * Get files sent by a specific address
   * @param address The sender's address
   * @returns Array of file IDs and metadata
   */
  async getSentFiles(address: string): Promise<StoredFile[]> {
    try {
      const query = `{
        transactions(
          tags: [
            { name: "App-Name", values: ["TUMA-Document-Exchange"] },
            { name: "Sender", values: ["${address}"] }
          ]
        ) {
          edges {
            node {
              id
              tags {
                name
                value
              }
            }
          }
        }
      }`;

      const response = await fetch('https://arweave.net/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();
      return this.parseGraphQLResponse(result);
    } catch (error) {
      console.error('Error getting sent documents:', error);
      toast.error('Failed to retrieve sent documents');
      throw error;
    }
  }

  /**
   * Get files received by a specific address
   * @param address The recipient's address
   * @returns Array of file IDs and metadata
   */
  async getReceivedFiles(address: string): Promise<StoredFile[]> {
    try {
      const query = `{
        transactions(
          tags: [
            { name: "App-Name", values: ["TUMA-Document-Exchange"] },
            { name: "Recipient", values: ["${address}"] }
          ]
        ) {
          edges {
            node {
              id
              tags {
                name
                value
              }
            }
          }
        }
      }`;

      const response = await fetch('https://arweave.net/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();
      return this.parseGraphQLResponse(result);
    } catch (error) {
      console.error('Error getting received documents:', error);
      toast.error('Failed to retrieve received documents');
      throw error;
    }
  }

  /**
   * Parse GraphQL response to extract file metadata
   * @param response The GraphQL response
   * @returns Array of file IDs and metadata
   */
  private parseGraphQLResponse(response: any): StoredFile[] {
    const files: StoredFile[] = [];

    if (response.data && response.data.transactions && response.data.transactions.edges) {
      response.data.transactions.edges.forEach((edge: any) => {
        const node = edge.node;
        const id = node.id;
        const tags: Record<string, string> = {};

        node.tags.forEach((tag: any) => {
          tags[tag.name] = tag.value;
        });

        const metadata: FileMetadata = {
          name: tags['Document-Name'] || 'Unknown',
          type: tags['Document-Type'] || 'Unknown',
          size: parseInt(tags['Document-Size'] || '0'),
          sender: tags['Sender'] || 'Unknown',
          recipient: tags['Recipient'] || 'Unknown',
          timestamp: parseInt(tags['Timestamp'] || Date.now().toString()),
          description: tags['Description'],
        };

        files.push({ id, metadata });
      });
    }

    return files;
  }
}

// Export singleton instance
export const arweaveService = new ArweaveService();
