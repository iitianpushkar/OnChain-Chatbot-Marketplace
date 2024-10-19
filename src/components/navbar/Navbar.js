import React, { useState, useEffect, useContext } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';
import { ethers } from 'ethers';

function Navbar() {
    // Sepolia Testnet Chain ID
    const TESTNET_CHAIN_ID = '0xaa36a7'; // Sepolia Testnet Chain ID
    const CONTRACT_ADDRESS = "0x02e13508ee5917a6258b86322ea8275fe94114c3"
    const ABI = [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "seller",
                    "type": "address"
                }
            ],
            "name": "ChatbotListed",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "buyer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                }
            ],
            "name": "ChatbotPurchased",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_description",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_price",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "_imageUrl",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_fileUploadUrl",
                    "type": "string"
                }
            ],
            "name": "listChatbot",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_id",
                    "type": "uint256"
                }
            ],
            "name": "purchaseChatbot",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "chatbotBuyers",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "chatbotCount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "chatbots",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "imageUrl",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "fileUploadUrl",
                    "type": "string"
                },
                {
                    "internalType": "address payable",
                    "name": "seller",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_id",
                    "type": "uint256"
                }
            ],
            "name": "getBuyersByChatbot",
            "outputs": [
                {
                    "internalType": "address[]",
                    "name": "",
                    "type": "address[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_owner",
                    "type": "address"
                }
            ],
            "name": "getChatbotsByOwner",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "",
                    "type": "uint256[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "ownedChatbots",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
    

    const { account, setAccount, contract, setContract } = useContext(UserContext);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);

    // Function to request network change to Sepolia Testnet
    const switchToTestnet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                // Check if the user is already on the Sepolia network
                const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
                if (currentChainId !== TESTNET_CHAIN_ID) {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: TESTNET_CHAIN_ID }],
                    });
                }
            } catch (switchError) {
                // If the chain has not been added to MetaMask, ask the user to add it
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: TESTNET_CHAIN_ID,
                                    chainName: 'Sepolia Testnet',
                                    rpcUrls: ['https://sepolia.infura.io/v3/0a3f6c7c76484e49b9d900a04632fa69'], // Replace with your Infura URL
                                    blockExplorerUrls: ['https://sepolia.etherscan.io'],
                                    nativeCurrency: {
                                        name: 'SepoliaETH',
                                        symbol: 'ETH',
                                        decimals: 18,
                                    },
                                },
                            ],
                        });
                    } catch (addError) {
                        console.error('Failed to add network:', addError);
                    }
                } else {
                    console.error('Error switching network:', switchError);
                }
            }
        }
    };

    // Function to connect wallet
    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                // Request MetaMask to switch to the Sepolia testnet
                await switchToTestnet();

                const Provider = new ethers.BrowserProvider(window.ethereum);
                setProvider(Provider);

                // Request account access
                const accounts = await Provider.send('eth_requestAccounts', []);
                setAccount(accounts[0]);

                const Signer = await Provider.getSigner();
                setSigner(Signer);

                const Contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, Signer);
                       await setContract(Contract);

                console.log('Connected account:', accounts[0],Contract);
            } catch (err) {
                console.error('Error connecting wallet:', err);
            }
        } else {
            alert('MetaMask is not installed. Please install it to use this dApp.');
        }
    };

    // Listen for account changes
    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.on('accountsChanged', (accounts) => {
                setAccount(accounts[0] || ''); // Update account state
            });

            window.ethereum.on('chainChanged', () => {
                window.location.reload(); // Reload the page on network change
            });
        }
    }, []);

    // Function to disconnect wallet
    const disconnectWallet = () => {
        setAccount(''); // Clear account
        setProvider(null); // Clear provider
        setSigner(null); // Clear signer
    };

    return (
        <nav className="navbar">
            <div className="navbar-menu">
                <button className="navbar-toggle">
                    <span>&#9776;</span>
                </button>
            </div>
            <ul className="navbar-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/chatbots">Chatbots</Link></li>
                <li><Link to="/purchases">Purchases</Link></li>
            </ul>
            <div>
                {account ? (
                    <>
                        <button className="wallet-button" style={{ backgroundColor: '#00c853' }} onClick={disconnectWallet}>
                            Disconnect Wallet
                        </button>
                        <p style={{ color: '#ffffff' }}>Connected Account: {account}</p>
                    </>
                ) : (
                    <button className="wallet-button" onClick={connectWallet}>Connect Wallet (Testnet)</button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
