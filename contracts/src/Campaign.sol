pragma solidity ^0.4.24;

contract FactoryCampaign {
    address[] public campaignsList;

    // need function to start a new campaign
    // we can't actually return from the function
    // which processes the transaction.
    // the information that we recieve
    // is like given in file - samples/transactionFunctionOutput.txt
    function startCampaign(string desc, uint minAmt)
    public {
        address newCampaign = new Campaign(desc, minAmt, msg.sender);
        campaignsList.push(newCampaign);
    }

    function getDeployedContracts()
    public view returns (address[]) {
        return campaignsList;
    }
}

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
        bool srIsFinalized;
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

    modifier onlyIfApproved
    (uint requestId) {
        // put a cut off of 51%
        // require(cSpendingRequests[requestId].srYayCount > (0.51*cDonorCount));
        require(cSpendingRequests[requestId].srYayCount * 2 > cDonorCount, "You do not have cumulative approval to finalize the request.");
        _;
    }

    modifier onlyIfNotFinalizedYet
    (uint requestId) {
        require(
            cSpendingRequests[requestId].srIsFinalized == false,
            "The request you are trying to operate on has already been approved"
        );
        _;
    }

    constructor(string desc, uint minDonation, address manager) public {
        cManager = manager;
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
            srApprovalResponseCount: 0,
            srIsFinalized: false
        });
        cSpendingRequestsCount++;
        cSpendingRequests.push(newSepndingReq);
        return newSepndingReq.srId;
    }

    // Consider - not voting is equivalent to disapproving
    function voteOnSpendingRequest(uint requestId, uint vote)
    public
    onlyDonor()
    onlyIfValidRequestId(requestId)
    onlyIfNotVotedPreviously(requestId)
    onlyIfValidVotingOption(vote)
    onlyIfNotFinalizedYet(requestId)
    returns(uint responseCount, uint yayCount) {
        cSpendingRequests[requestId].srApprovalResponseCount++;
        cSpendingRequests[requestId].srApprovers[msg.sender] = votingStatus(vote);
        if (votingStatus(vote) == votingStatus.YAY) {
            cSpendingRequests[requestId].srYayCount++;
        }
        return (
            cSpendingRequests[requestId].srApprovalResponseCount,
            cSpendingRequests[requestId].srYayCount
        );
    }

    function finalizeSpendingRequest(uint requestId)
    public
    onlyManager()
    onlyIfApproved(requestId)
    onlyIfNotFinalizedYet(requestId)
    returns(bool isApproved) {
        cManager.transfer(cSpendingRequests[requestId].srAmount);
        cBalance -= cSpendingRequests[requestId].srAmount;
        require(cBalance == address(this).balance, "The balance after transfer was not equal. Reverting transaction! Please check the history.");
        cSpendingRequests[requestId].srIsFinalized = true;
        return cSpendingRequests[requestId].srIsFinalized;
    }

    function getCampaignSummary()
    public view returns(address, string, uint, uint, uint, uint) {
        return (
            cManager,
            cDescription,
            cMinAllowedDonation,
            cBalance,
            cDonorCount,
            cSpendingRequestsCount
        );
    }

    function getSpendingRequestSummary(uint srId)
    public view
    onlyIfValidRequestId(srId)
    returns(uint, uint, string, uint, uint, bool) {
        return (
                cSpendingRequests[srId].srId,
                cSpendingRequests[srId].srAmount,
                cSpendingRequests[srId].srDescription,
                cSpendingRequests[srId].srYayCount,
                cSpendingRequests[srId].srApprovalResponseCount,
                cSpendingRequests[srId].srIsFinalized
        );
    }

    // TODO: Find if the spending request got rejected
}