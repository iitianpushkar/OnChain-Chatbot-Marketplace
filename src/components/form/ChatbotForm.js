import { motion } from 'framer-motion';
import Carousel from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './ChatbotForm.css';
import axios from 'axios';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // for navigation
import { formatEther, parseEther } from 'ethers';
import { UserContext } from '../../App';

function ChatbotForm() {
    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    const JWT = process.env.REACT_APP_JWT;

    const { account, setAccount, contract, setContract } = useContext(UserContext);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imagehash, setImagehash] = useState("");
    const [filehash, setFilehash] = useState("");
    const [loading, setLoading] = useState(false); // Loading state for the button

    const navigate = useNavigate(); // initialize navigate function

    // Function to upload to Pinata
    const uploadToPinata = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                headers: { Authorization: `Bearer ${JWT}`, 'Content-Type': 'multipart/form-data' },
            });
            return `${res.data.IpfsHash}`;
        } catch (error) {
            console.error("Error uploading to Pinata:", error);
            return null;
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        const imageipfsHash = await uploadToPinata(file);
        setImagehash(imageipfsHash);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const fileipfsHash = await uploadToPinata(file);
        setFilehash(fileipfsHash);
    };

    // Function to handle form submission and navigate to /chatbots
    const handleSubmit = async ({ name, description, price, imagehash, filehash }) => {
        // Make sure required fields are filled
        if (name && imagehash && description && filehash && price) {
            setLoading(true); // Set loading state to true
            try {
                const tx = await contract.listChatbot(
                    name,
                    description,
                    parseEther(price),
                    imagehash,
                    filehash,
                );

                await tx.wait();
                alert("Chatbot registered successfully!");
            } catch (error) {
                console.error("Transaction failed:", error);
                alert("Transaction failed. Please try again.");
            } finally {
                // Reset fields and loading state
                setName("");
                setDescription("");
                setPrice("");
                setImagehash("");
                setFilehash("");
                setLoading(false); // Reset loading state
            }
        }
    };

    return (
        <>
            <div className="chatbot-form" style={{ marginTop: '10px'}}>
                <div className="carousel-container">
                    <Carousel {...carouselSettings}>
                        <div><h2>Welcome to OnChain Chatbot Marketplace!</h2></div>
                        <div><h2>Register your chatbot by filling the form.</h2></div>
                        <div><h2>Price your chatbot in ETH for easy transactions.</h2></div>
                    </Carousel>
                </div>

                <div className="content-container">
                    <div className="upload-box image-upload">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="upload-section"
                        >
                            <p>Upload Image</p>
                            <input type="file" className="image-input" onChange={handleImageUpload} />
                        </motion.div>
                    </div>

                    <div className="form-container">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="form"
                        >
                            <motion.div className="input-group" initial={{ x: -100 }} animate={{ x: 0 }} transition={{ duration: 0.5 }}>
                                <label>Name</label>
                                <input id="name" type="text" placeholder="Register with full name" onChange={(e) => setName(e.target.value)} />
                            </motion.div>

                            <motion.div className="input-group" initial={{ x: -100 }} animate={{ x: 0 }} transition={{ duration: 0.5 }}>
                                <label>Image Hash</label>
                                <input id="image" type="text" placeholder="your image hash" value={imagehash} readOnly />
                            </motion.div>

                            <motion.div className="input-group" initial={{ x: -100 }} animate={{ x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                                <label>Description</label>
                                <input id='description' type="text" placeholder="Give description about your chatbot" onChange={(e) => setDescription(e.target.value)} />
                            </motion.div>

                            <motion.div className="input-group" initial={{ x: -100 }} animate={{ x: 0 }} transition={{ duration: 0.5 }}>
                                <label>File Hash</label>
                                <input id="file" type="text" placeholder="your file hash" value={filehash} readOnly />
                            </motion.div>

                            <motion.div className="input-group" initial={{ x: -100 }} animate={{ x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                                <label>Price (ETH)</label>
                                <input id='price' type="number" placeholder="Price of your chatbot" onChange={(e) => setPrice(e.target.value)} />
                            </motion.div>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                className="register-button"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                onClick={() => handleSubmit({ name, description, price, imagehash, filehash })}
                            >
                                {loading ? 'Registering...' : 'Register'} {/* Button text changes based on loading state */}
                            </motion.button>
                        </motion.div>
                    </div>

                    <div className="upload-box file-upload">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="upload-section"
                        >
                            <p>Upload txt File</p>
                            <input type="file" className="file-input" onChange={handleFileUpload} />
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChatbotForm;
