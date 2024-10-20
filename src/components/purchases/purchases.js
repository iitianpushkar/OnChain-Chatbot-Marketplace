import React, { useState, useEffect, useContext } from 'react';
import Modal from 'react-modal'; // Import the react-modal library
import { UserContext } from '../../App';
import { formatEther } from 'ethers';
import axios from 'axios'; 
// Ensure the modal is accessible
Modal.setAppElement('#root');

function Purchases() {
    const { contract, account, ownedChatbots, setownedChatbots } = useContext(UserContext);
    const [selectedChatbot, setSelectedChatbot] = useState(null); // For tracking the chatbot to chat with
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [messages, setMessages] = useState([]); // To store chat messages
    const [inputMessage, setInputMessage] = useState(''); // Store the current user input
    

    const OPENAI_API_KEY = process.env.REACT_APP_OPENAI;

    const purchasedChatBots = async (contract) => {
        const ownedchatbots = [];
        const purchasedchatbots = await contract.getChatbotsByOwner(account);
        console.log("Purchased Chatbots: " + purchasedchatbots);
        for (let i = 0; i < purchasedchatbots.length; i++) {
            const chatbot = await contract.chatbots(purchasedchatbots[i]);
            ownedchatbots.push(chatbot);
        }
        setownedChatbots(ownedchatbots);
        console.log("Owned Chatbots: " + ownedchatbots);
    };

    useEffect(() => {
        if (!contract) return;
        purchasedChatBots(contract);
    }, [contract]);

    const openChatModal = async (chatbot) => {
        setSelectedChatbot(chatbot); // Set the selected chatbot
        setIsModalOpen(true); // Open the modal

        // Destructure properties directly from the chatbot object
        const { fileUploadUrl, name } = chatbot;
        console.log(fileUploadUrl);
        
        try {
            const res = await axios.get(`https://pink-glad-orangutan-610.mypinata.cloud/ipfs/${fileUploadUrl}`, { responseType: 'text' });
            
            const pdftext = res.data;
            console.log(pdftext)
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-4o', // Change this to 'gpt-4' or a valid model if necessary
                messages: [{
                    role: 'system',
                    content: `From now on, you are ${name}. Please base your responses on the context provided here: ${pdftext}. Do not answer anything else.`
                }],
            }, {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json' // Ensure the content type is set correctly
                }
            });

            console.log(response);
        } catch (error) {
            console.error('Error communicating with OpenAI:', error);
        }
    };

    const closeChatModal = () => {
        setIsModalOpen(false); // Close the modal
        setSelectedChatbot(null); // Clear the selected chatbot
        setMessages([]); // Clear chat messages
    };

    const handleSendMessage = async () => {
        if (!inputMessage) return;

        // Add user's message to the chat
        setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: inputMessage }]);

        try {
            // Make an API request to OpenAI
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-4o',
                messages: [{ role: 'system', content: inputMessage }],
            }, {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            const chatbotReply = response.data.choices[0].message.content;

            // Add chatbot's reply to the chat
            setMessages((prevMessages) => [...prevMessages, { sender: 'chatbot', text: chatbotReply }]);

        } catch (error) {
            console.error('Error communicating with OpenAI:', error);
        }

        // Clear the input field after sending
        setInputMessage('');
    };

    return (
        <div>
            <div className="chatbot-container">
                <div className="content" style={{ marginTop: '600px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <h1 className="text-center mb-5" style={{ width: '100%', textAlign: 'center' }}>Your Purchases</h1>
                    {contract && ownedChatbots.length ? (
                        ownedChatbots.map((chatbot, index) => (
                            <div key={index} style={{ width: '30%', marginBottom: '30px' }}>
                                <div className="card" style={{ border: 'none', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px', marginTop: '20px' }}>
                                    <img
                                        className="card-img-top"
                                        src={`https://pink-glad-orangutan-610.mypinata.cloud/ipfs/${chatbot.imageUrl}`}
                                        alt={chatbot.name}
                                        style={{ height: '250px', objectFit: 'cover', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', width: '100%' }}
                                    />
                                    <div className="card-body" style={{ padding: '20px' }}>
                                        <h5 className="card-title" style={{ fontSize: '1.4rem' }}>{chatbot.name}</h5>
                                        <p className="card-text" style={{ maxHeight: '70px', overflow: 'hidden' }}>{chatbot.description}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => openChatModal(chatbot)}
                                                style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', padding: '10px 20px' }}
                                            >
                                                Chat
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>

            {/* Chat Modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeChatModal}
                contentLabel="Chat with Chatbot"
                style={{
                    content: {
                        top: '60%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '500px',
                        borderRadius: '10px',
                        backgroundColor: '#1b1b1b',
                        padding: '0',
                        color: '#fff',
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    }
                }}
            >
                {/* Header with avatar and name */}
                <div style={{ display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '1px solid #333' }}>
                    <img
                        src={`https://pink-glad-orangutan-610.mypinata.cloud/ipfs/${selectedChatbot?.imageUrl}`}
                        alt={selectedChatbot?.name}
                        style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '15px' }}
                    />
                    <h2>{selectedChatbot?.name}</h2>
                </div>

                {/* Chat conversation */}
                <div style={{ height: '300px', overflowY: 'auto', padding: '15px', borderBottom: '1px solid #333' }}>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            style={{
                                marginBottom: '10px',
                                display: 'flex',
                                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                            }}
                        >
                            {message.sender !== 'user' && (
                                <img
                                    src={`https://pink-glad-orangutan-610.mypinata.cloud/ipfs/${selectedChatbot?.imageUrl}`}
                                    alt="Chatbot Avatar"
                                    style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }}
                                />
                            )}
                            <div
                                style={{
                                    backgroundColor: message.sender === 'user' ? '#007bff' : '#333',
                                    color: '#fff',
                                    padding: '10px',
                                    borderRadius: '10px',
                                    maxWidth: '70%',
                                    textAlign: 'left'
                                }}
                            >
                                {message.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer with input and send button */}
                <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333' }}>
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        style={{ width: '75%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: '#fff' }}
                        placeholder="Type your message..."
                    />
                    <button
                        className="btn btn-success"
                        onClick={handleSendMessage}
                        style={{ padding: '10px 15px', borderRadius: '5px', backgroundColor: '#28a745', color: '#fff' }}
                    >
                        Send
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default Purchases;
