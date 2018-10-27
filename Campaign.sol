pragma solidity ^0.4.25;

contract Campaign {
    address public cManager;
    string public cDescription;
    uint public cBalance;
    uint public cMinAllowedDonation;
    mapping(address => bool) private cDonors;
    uint public cDonorCount;
    uint public cSpendingRequestsCount;
    SpendingRequest[] public cSpendingRequests;

    enum votingStatus { NOTVOTED, YAY, NAY }

    struct SpendingRequest {
        uint srId;
        uint srAmount;
        string srDescription;
        mapping(address => votingStatus) srApprovers;
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
        require(address(this).balance >= amount, "Campaign does not have sufficient funds to process this spending request");
        _;
    }

    // @NOTE: for vote - [0: NotVoted, 1: Yay, 2: Nay]
    modifier onlyIfNotVotedPreviously
    (uint requestId) {
        votingStatus status = cSpendingRequests[requestId].srApprovers[msg.sender];
        require(status == votingStatus.NOTVOTED, "You have already voted.");
        _;
    }

    // This modifier may not make sense here but,
    // checking twice never goes to waste.
    modifier onlyIfValidVotingOption
    (uint vote) {
        require(vote == 1 || vote == 2, "Please vote out of valid options.");
        _;
    }

    modifier onlyIfValidRequestId
    (uint requestId) {
        require(requestId < cSpendingRequestsCount, "Please select valid spending request.");
        _;
    }

    constructor(string desc, uint minDonation) public {
        cManager = msg.sender;
        cDescription = desc;
        cMinAllowedDonation = minDonation;
        cBalance = 0;
        cDonorCount = 0;
        cSpendingRequestsCount = 0;
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

    function raiseSpendingRequest(string desc, uint amount)
    public
    onlyManager()
    onlyIfFundsAvailable(amount)
    returns(uint) {
        SpendingRequest memory newSepndingReq = SpendingRequest({
            srId:cSpendingRequestsCount,
            srAmount:amount,
            srDescription: desc,
            srYayCount: 0,
            srApprovalResponseCount: 0
        });
        cSpendingRequestsCount++;
        cSpendingRequests.push(newSepndingReq);
        return newSepndingReq.srId;
    }

    // Consider - not voting is equivalent to disapproving
    function voteOnSpendingRequest(uint requestId, uint vote)
    public
    onlyDonor() onlyIfValidRequestId(requestId) onlyIfNotVotedPreviously(requestId) onlyIfValidVotingOption(vote)
    returns(uint responseCount, uint yayCount) {
        cSpendingRequests[requestId].srApprovalResponseCount++;
        cSpendingRequests[requestId].srApprovers[msg.sender] = votingStatus(vote);
        if (votingStatus(vote) == votingStatus.YAY) {
            cSpendingRequests[requestId].srYayCount++;
        }
        return (cSpendingRequests[requestId].srApprovalResponseCount,
                cSpendingRequests[requestId].srYayCount);
    }
}