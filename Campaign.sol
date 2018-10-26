pragma solidity ^0.4.25;

contract Campaign {
    address public cManager;
    string public cDescription;
    uint public cBalance;
    uint public cMinAllowedDonation;
    mapping(address => bool) private cDonors;

    // This is to find out if the memory limit of the used datatype
    // is reaching to the level of overflow.
    modifier notOverflowing {
        require((cBalance + msg.value) == address(this).balance, "The datatype used for balance is overflowing. Please use bigger type.");
        _;
    }

    modifier onlyDonor {
        require(cDonors[msg.sender] == true, "Sender is not a Donor.");
        _;
    }

    modifier onlyManager {
        require(cManager == msg.sender, "Sender is not the Manager.");
        _;
    }

    modifier onlyIfMoreThanMinDonation {
        require(cMinAllowedDonation <= msg.value, "Sender has not met the min donation requirement");
        _;
    }

    constructor(string desc, uint minDonation) public {
        cManager = msg.sender;
        cDescription = desc;
        cMinAllowedDonation = minDonation;
        cBalance = 0;
    }

    function donateToCampaign()
    public
    payable
    notOverflowing ()
    onlyIfMoreThanMinDonation()
    returns(uint amtDonated, uint totalBalanace)
    {
        cDonors[msg.sender] = true;
        cBalance += msg.value;
        return (msg.value, cBalance);
    }

}