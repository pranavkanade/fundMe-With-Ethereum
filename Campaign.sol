pragma solidity ^0.4.25;

contract Campaign {
    address public cManager;
    string public cDescription;
    uint public cBalance;

    constructor(string desc) public {
        cManager = msg.sender;
        cDescription = desc;
        cBalance = 0;
    }
}