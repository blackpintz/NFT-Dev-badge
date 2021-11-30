//SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;

    constructor(address jobPostAddress) ERC721("GE job tokens", "GET") {
        contractAddress = jobPostAddress;
    }

    function createToken() public returns(uint) {
        _tokenIds.increment();
        uint newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }

    function setTokenURI (uint _tokenId, string memory tokenURI) public {
        _setTokenURI(_tokenId, tokenURI);
    }

}