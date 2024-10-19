import React from 'react';

function About() {
    return (
        <div style={{ padding: '50px', backgroundColor: '#111', color: '#fff', textAlign: 'center', marginTop: '50px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>About Us</h1>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '30px' }}>
                Welcome to Onchain Chatbot Marketplace, a pioneering platform where AI technology meets the decentralized power of blockchain. 
                Our mission is to provide users with a secure, transparent, and innovative space to discover, purchase, and interact with AI-powered chatbots.
            </p>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '30px' }}>
                Built on the Ethereum blockchain, our marketplace allows creators to list their custom chatbots, and users can securely purchase them using cryptocurrency. 
                Every transaction is verified on the blockchain, ensuring full transparency and eliminating the need for intermediaries. 
                The chatbots are minted as unique digital assets (NFTs), giving users full ownership and the ability to engage with advanced AI directly.
            </p>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Key Features</h2>
            <ul style={{ fontSize: '1.2rem', lineHeight: '1.6', listStyle: 'none', padding: 0 }}>
                <li>🔒 <strong>Decentralized Ownership</strong>: Once purchased, the chatbot is owned by you, verified by blockchain technology.</li>
                <li>💰 <strong>Secure Payments</strong>: Purchase chatbots using Ether (ETH) for safe, fast, and secure transactions.</li>
                <li>🤖 <strong>Personal AI Assistants</strong>: Each chatbot is equipped with AI capabilities, enabling dynamic interactions and assistance across various tasks.</li>
                <li>🚀 <strong>Creator Empowerment</strong>: Chatbot creators can easily monetize their creations and receive direct payouts in cryptocurrency.</li>
            </ul>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginTop: '30px' }}>
                Join us in shaping the future of AI-powered communication with the security and freedom of blockchain technology.
            </p>
        </div>
    );
}

export default About;
