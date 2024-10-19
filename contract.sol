// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ChatbotMarket {
    struct Chatbot {
        uint id;
        string name;
        string description;
        uint price; // Price in wei (smallest unit of ether)
        string imageUrl;
        string fileUploadUrl;
        address payable seller;
    }

    uint public chatbotCount = 0;
    mapping(uint => Chatbot) public chatbots;
    mapping(address => uint[]) public ownedChatbots; // Track which chatbots an address owns
    mapping(uint => address[]) public chatbotBuyers; // Track buyers of a specific chatbot

    event ChatbotListed(uint id, string name, uint price, address seller);
    event ChatbotPurchased(uint id, address buyer, uint price);

    // List a new chatbot for sale
    function listChatbot(
        string memory _name, 
        string memory _description, 
        uint _price, 
        string memory _imageUrl, 
        string memory _fileUploadUrl
    ) public {
        require(_price > 0, "Price must be greater than zero");

        chatbotCount++;
        chatbots[chatbotCount] = Chatbot(
            chatbotCount,
            _name,
            _description,
            _price,
            _imageUrl,
            _fileUploadUrl,
            payable(msg.sender)
        );

        emit ChatbotListed(chatbotCount, _name, _price, msg.sender);
    }

    // Purchase a chatbot
    function purchaseChatbot(uint _id) public payable {
        Chatbot storage chatbot = chatbots[_id];
        require(_id > 0 && _id <= chatbotCount, "Chatbot does not exist");
        require(msg.value == chatbot.price, "Incorrect price");

        // Transfer payment to the seller
        chatbot.seller.transfer(msg.value);

        // Record the buyer as a chatbot owner
        ownedChatbots[msg.sender].push(_id);
        chatbotBuyers[_id].push(msg.sender); // Track the buyer for this specific chatbot

        emit ChatbotPurchased(_id, msg.sender, chatbot.price);
    }

    // Get chatbots owned by a specific owner
    function getChatbotsByOwner(address _owner) public view returns (uint[] memory) {
        return ownedChatbots[_owner];
    }

    // Get all buyers of a specific chatbot
    function getBuyersByChatbot(uint _id) public view returns (address[] memory) {
        return chatbotBuyers[_id];
    }
}
