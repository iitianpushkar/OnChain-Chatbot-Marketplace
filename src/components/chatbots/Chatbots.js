import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../App';
import { formatEther,parseEther } from 'ethers';
import './Chatbots.css'; // Import custom CSS for styling

function Chatbots() {
    const { contract,setcontract,account,setAccount,ownedChatbots,setownedChatbots } = useContext(UserContext);
    const [chatbots, setChatbots] = useState([]);
    const [loading, setLoading] = useState(false);

    const getChatBots = async (contract) => {
        const chatbotCount = await contract.chatbotCount();
        console.log("Chatbot Count: " + chatbotCount);
        let chatbots = [];
        for (let i = 1; i <= chatbotCount; i++) {
            const chatbot = await contract.chatbots(i);
            chatbots.push({
                id: i,
                name: chatbot.name,
                description: chatbot.description,
                price: formatEther(chatbot.price),
                image: chatbot.imageUrl,
                file: chatbot.fileUploadUrl,
                seller: chatbot.seller
            });
        }
        setChatbots(chatbots);
        console.log(chatbots);
    };

    useEffect(() => {
        if (!contract) return;
        getChatBots(contract);
    }, [contract]);


    const purchaseChatbot = (id) => async () => {
        
        const alreadyOwned = ownedChatbots.some(chatbot => chatbot.id == id); // Assuming chatbot object contains an 'id' field
    if (alreadyOwned) {
        alert("You have already purchased this chatbot");
        return;
    }

        if(account===chatbots[id-1].seller.toLowerCase()){
            alert("You cannot purchase your own chatbot");
            return;
        }

        setLoading(true);
        console.log("Purchasing chatbot with id: " + id);
        const priceInWei = parseEther(chatbots[id - 1].price);
        const tx = await contract.purchaseChatbot(id,{value: priceInWei});
        await tx.wait();
        //window.location.reload(); // Reload the page to update the list
        setLoading(false);
        alert("Chatbot purchased successfully!");
    }
    return (
        <div className="chatbot-container"> {/* Use custom class for background */}
    <div className="content" style={{ marginTop: '500px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}> {/* Adjust marginTop to avoid overlap with fixed navbar */}
        <h1 className="text-center mb-5" style={{ width: '100%', textAlign: 'center' }}>Chatbot Market</h1>
        {contract && chatbots.length ? (
            chatbots.map((chatbot, index) => (
                <div key={index} style={{ width: '30%', marginBottom: '20px' }}> {/* Adjust width and margin for spacing */}
                    <div className="card" style={{ border: 'none', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px', marginTop: '20px' }}>
                        <img 
                            className="card-img-top"
                            src={`https://pink-glad-orangutan-610.mypinata.cloud/ipfs/${chatbot.image}`}
                            alt={chatbot.name}
                            style={{ height: '200px', objectFit: 'cover', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', width: '100%' }} 
                        />
                        <div className="card-body" style={{ padding: '15px' }}>
                            <h5 className="card-title" style={{ fontSize: '1.2rem' }}>{chatbot.name}</h5>
                            <p className="card-text" style={{ maxHeight: '50px', overflow: 'hidden' }}>{chatbot.description}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                <span className="text-muted">{chatbot.price} ETH</span>
                                <button className="btn btn-primary" onClick={purchaseChatbot(index+1)} style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', padding: '10px 15px' }}>
                                  Buy
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


    );
}

export default Chatbots;
