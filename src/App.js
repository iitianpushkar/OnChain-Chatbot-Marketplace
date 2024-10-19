// src/App.js
import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import ChatbotForm from './components/form/ChatbotForm';
import About from './components/about/About';
import Chatbots from './components/chatbots/Chatbots';
import Purchases from './components/purchases/purchases';

export const UserContext = createContext();

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [ownedChatbots, setownedChatbots] = useState([]);

  return (
    <UserContext.Provider value={{ account, setAccount, contract, setContract, ownedChatbots, setownedChatbots }}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ChatbotForm />} />
          <Route path="/about" element={<About />} />
          <Route path="/chatbots" element={<Chatbots />} />
          <Route path="/purchases" element={<Purchases />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
