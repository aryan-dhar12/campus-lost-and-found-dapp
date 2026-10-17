// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CampusLostAndFound
 * @notice A transparent record of found campus items and their return status.
 */
contract CampusLostAndFound {
    enum Status { Open, ClaimRequested, ClaimApproved, Returned }

    struct Item {
        uint256 id;
        string title;
        string category;
        string locationFound;
        string description;
        address finder;
        address claimant;
        Status status;
        uint256 createdAt;
    }

    address public immutable administrator;
    uint256 public itemCount;
    mapping(uint256 => Item) private items;

    event ItemRegistered(uint256 indexed itemId, address indexed finder, string title);
    event ClaimRequested(uint256 indexed itemId, address indexed claimant);
    event ClaimApproved(uint256 indexed itemId, address indexed finder, address indexed claimant);
    event ItemReturned(uint256 indexed itemId, address indexed finder, address indexed claimant);

    constructor() { administrator = msg.sender; }

    modifier validItem(uint256 itemId) {
        require(itemId > 0 && itemId <= itemCount, "Item does not exist");
        _;
    }

    modifier onlyFinder(uint256 itemId) {
        require(msg.sender == items[itemId].finder, "Only the finder can perform this action");
        _;
    }

    function registerItem(string calldata title, string calldata category, string calldata locationFound, string calldata description) external {
        require(bytes(title).length >= 3, "Title must contain at least 3 characters");
        require(bytes(category).length > 0, "Category is required");
        require(bytes(locationFound).length > 0, "Location is required");
        itemCount++;
        items[itemCount] = Item(itemCount, title, category, locationFound, description, msg.sender, address(0), Status.Open, block.timestamp);
        emit ItemRegistered(itemCount, msg.sender, title);
    }

    function requestClaim(uint256 itemId) external validItem(itemId) {
        Item storage item = items[itemId];
        require(item.status == Status.Open, "Item is not open for a claim");
        require(msg.sender != item.finder, "Finder cannot claim their own item");
        item.claimant = msg.sender;
        item.status = Status.ClaimRequested;
        emit ClaimRequested(itemId, msg.sender);
    }

    function approveClaim(uint256 itemId) external validItem(itemId) onlyFinder(itemId) {
        Item storage item = items[itemId];
        require(item.status == Status.ClaimRequested, "No claim is waiting for approval");
        item.status = Status.ClaimApproved;
        emit ClaimApproved(itemId, msg.sender, item.claimant);
    }

    function markReturned(uint256 itemId) external validItem(itemId) onlyFinder(itemId) {
        Item storage item = items[itemId];
        require(item.status == Status.ClaimApproved, "An approved claim is required first");
        item.status = Status.Returned;
        emit ItemReturned(itemId, msg.sender, item.claimant);
    }

    function getItem(uint256 itemId) external view validItem(itemId) returns (Item memory) { return items[itemId]; }
    function getAllItems() external view returns (Item[] memory) {
        Item[] memory allItems = new Item[](itemCount);
        for (uint256 i = 1; i <= itemCount; i++) allItems[i - 1] = items[i];
        return allItems;
    }
}
