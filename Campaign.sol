pragma solidity ^0.4.25;

contract Campaign {
    address public cManager;
    string public cDescription;
    uint public cBalance;
    uint public cMinAllowedDonation;
    mapping(address => bool) private cDonors;
    uint public cDonorCount;
    SpendingRequest[] public cSpendingRequests;

    struct SpendingRequest {
        uint srAmount;
        string srDescription;
        mapping(address => bool) srApprovers;
        uint srYayCount; // to find out how many support
        uint srApprovalResponseCount;
    }

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

    modifier onlyIfAtleastHasMoneyTryingToDonate {
        require(msg.sender.balance >= msg.value, "Sender does not have sufficient funds");
        _;
    }

    modifier onlyIfFundsAvailable (uint amount) {
        require(address(this).balance >= amount, "Sufficient funds not available.");
        _;
    }

    constructor(string desc, uint minDonation) public {
        cManager = msg.sender;
        cDescription = desc;
        cMinAllowedDonation = minDonation;
        cBalance = 0;
        cDonorCount = 0;
    }

    function donateToCampaign()
    public
    payable
    notOverflowing ()
    onlyIfMoreThanMinDonation()
    onlyIfAtleastHasMoneyTryingToDonate()
    returns(uint amtDonated, uint totalBalanace)
    {
        cDonors[msg.sender] = true;
        cDonorCount += 1;
        cBalance += msg.value;
        return (msg.value, cBalance);
    }

    function getBalance()
    public
    view
    returns(uint) {
        return address(this).balance;
    }

}