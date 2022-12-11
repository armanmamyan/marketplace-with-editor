// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./TokenCreator.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Editor is
    ERC1155Receiver,
    IERC721Receiver,
    ReentrancyGuard,
    Ownable
{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _createdTokenIds;
    Counters.Counter private _itemsSold;
    address private operator;
    address private mkNFTaddress;
    address private serviceWallet = owner();

    TokenCreator mkNFT;

    uint256 public serviceFee = 25 * 10 ** 17; // 2.5 %
    uint256 constant ROYALTY_MAX = 100 * 10 ** 18; // 10%

    constructor(
        address _nftAddress,
        address _operator,
        address _serviceWallet
    ) {
        mkNFTaddress = _nftAddress;
        operator = _operator;
        serviceWallet = _serviceWallet;
        mkNFT = TokenCreator(_nftAddress);
    }

    /**  STRUCT START */
    struct CreateToken {
        address nftContract;
        uint256 tokenId;
        address owner;
        uint256 price;
        bool currentlyListed;
        bool createdByMarketpalce;
    }

    /**  STRUCT END */

    /**  EVENTS START */
    event ItemListed(
        address indexed owner,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemCanceled(
        address indexed owner,
        address indexed nftAddress,
        uint256 indexed tokenId
    );

    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );
   
    event SetNFTAddress(address _sender, address _nftAddress);
    event ServiceFeeUpdated(uint256 _feePrice);
    event SetOperator(address _operatorAddress);
    event TokenCreated(
        string _tokenURI,
        uint256 _tokenId,
        address _ownerAddress
    );
    event TokenTransfered(uint256 _tokenId, address _from, address _to);
    /**  EVENTS START */

    /**  MAPPING START */
    //This mapping maps tokenId to token info and is helpful when retrieving details about a tokenId
    mapping(uint256 => CreateToken) private idToListedToken;
    /**  MAPPING END */

    /**  MODIFIERS END */
    modifier notListed(
        address nftAddress,
        uint256 tokenId,
        address owner
    ) {
        require(
            !idToListedToken[tokenId].currentlyListed,
            "Token is already listed"
        );
        _;
    }

    modifier isListed(address nftAddress, uint256 tokenId) {
        require(
            idToListedToken[tokenId].currentlyListed,
            "Can not proceed: Token is not listed"
        );
        _;
    }

    modifier onlyOperator() {
        require(
            msg.sender == operator,
            "Only operator is able to use the method"
        );
        _;
    }

    /**  MODIFIERS END */

    function updateServiceFee(uint256 _feePrice) external onlyOwner {
        serviceFee = _feePrice;
        emit ServiceFeeUpdated(_feePrice);
    }

    function setOperator(address _operatorAddress) external onlyOwner {
        operator = _operatorAddress;
        emit SetOperator(_operatorAddress);
    }

    //The first time a token is created, it is listed here
    function createToken(string memory _tokenURI) public returns (uint) {
        //Increment the tokenId counter, which is keeping track of the number of minted NFTs
        _createdTokenIds.increment();
        uint256 tokenID = _createdTokenIds.current();
        // Calling to Tradable Contract to create the token
        uint256 currentTokenId = mkNFT.create(
            msg.sender,
            tokenID,
            1,
            _tokenURI,
            ""
        );
        emit TokenCreated(_tokenURI, currentTokenId, msg.sender);
        return currentTokenId;
    }

    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    ) external nonReentrant {
        require(
            price > 0,
            "Price can not be 0"
        );

        IERC1155 nft = IERC1155(nftAddress);
        if (nft.supportsInterface(0xd9b67a26) == true) {
            require(
                nft.isApprovedForAll(msg.sender, address(this)),
                "NFT is not approved for sale"
            );
        }

        IERC721 nft721 = IERC721(nftAddress);
        if (nft721.supportsInterface(0x80ac58cd) == true) {
            require(
                nft.isApprovedForAll(msg.sender, address(this)),
                "NFT is not approved for sale"
            );
        }

        _tokenIds.increment();
        uint256 currentTokenID = _tokenIds.current();

        idToListedToken[currentTokenID] = CreateToken(
            nftAddress,
            tokenId,
            payable(msg.sender),
            price,
            true,
            true
        );

        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

    function executeSale(
        address _nftAddress,
        uint256 _tokenId
    ) external payable isListed(_nftAddress, _tokenId) nonReentrant {
        require(
            idToListedToken[_tokenId].currentlyListed,
            "Listing has ended"
        );
        require(msg.value > idToListedToken[_tokenId].price, "Price not met");

        _customTransfer(
            idToListedToken[_tokenId].owner,
            msg.sender,
            _nftAddress,
            _tokenId
        );

        _itemsSold.increment();
        uint256 fee;
        uint256 userReceipt = 0;

        if (serviceFee > 0 && serviceWallet != address(0)) {
            fee = (msg.value * serviceFee) / ROYALTY_MAX;
            userReceipt += fee;
            (bool success, ) = payable(serviceWallet).call{value: fee}("");
            require(success, "Transfer failed.");
        }

        require(msg.value >= userReceipt, "invalid royalty or service fee");
        userReceipt = msg.value - userReceipt;

        if (userReceipt > 0) {
            (bool isSuccess, ) = payable(idToListedToken[_tokenId].owner).call{
                value: userReceipt
            }("");
            require(isSuccess, "Transfer failed.");
        }

        _tokenIds.decrement();
        delete (idToListedToken[_tokenId]);
        emit ItemBought(
            msg.sender,
            _nftAddress,
            _tokenId,
            idToListedToken[_tokenId].price
        );
    }

    function cancelListing(
        address _nftAddress,
        uint256 _tokenId
    ) external isListed(_nftAddress, _tokenId) {
        _tokenIds.decrement();
        delete (idToListedToken[_tokenId]);
        emit ItemCanceled(msg.sender, _nftAddress, _tokenId);
    }

    function updateListing(
        address _nftAddress,
        uint256 _tokenId,
        uint256 newPrice
    ) external isListed(_nftAddress, _tokenId) nonReentrant {
        require(newPrice >= 0, "Price must be equal or above zero");

        idToListedToken[_tokenId].price = newPrice;
        emit ItemListed(msg.sender, _nftAddress, _tokenId, newPrice);
    }

    function _customTransfer(
        address _sender,
        address _receiver,
        address _nftAddress,
        uint256 _tokenId
    ) private returns (bool success) {
        // Get NFT collection contract
        IERC1155 nft = IERC1155(_nftAddress);
        if (nft.supportsInterface(0xd9b67a26) == true) {
            require(
                nft.balanceOf(_sender, _tokenId) != 0,
                "Caller is not the owner of the NFT"
            );
            nft.safeTransferFrom(_sender, _receiver, _tokenId, 1, "");
            emit TokenTransfered(_tokenId, _sender, _receiver);
            return true;
        }

        IERC721 nft721 = IERC721(_nftAddress);
        if (nft721.supportsInterface(0x80ac58cd) == true) {
            // Make sure the sender that wants to create a new auction
            // for a specific NFT is the owner of this NFT
            require(
                nft721.ownerOf(_tokenId) == _sender,
                "Caller is not the owner of the NFT"
            );
            nft721.safeTransferFrom(_sender, _receiver, _tokenId);
            emit TokenTransfered(_tokenId, _sender, _receiver);
            return true;
        }
    }

    function withDraw(uint256 _amount) external onlyOwner {
        require(_amount > 0, "Invalid withdraw amount...");
        require(address(this).balance > _amount, "None left to withdraw...");

        (bool isSuccess, ) = payable(msg.sender).call{value: _amount}("");
        require(isSuccess, "Withdraw failed.");
    }

    function withDrawAll() external onlyOwner {
        uint256 remaining = address(this).balance;
        require(remaining > 0, "None left to withdraw...");

        (bool isSuccess, ) = payable(msg.sender).call{value: remaining}("");
        require(isSuccess, "Withdraw failed.");
    }

    receive() external payable {}

    fallback() external payable {}

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public pure virtual returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public pure returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
