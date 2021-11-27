//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract MetaData {
    function hash(uint _tokenId, string memory _gitUrl, bytes32 _blockHash) 
    public pure returns(bytes32) {
        bytes32 gitHash = keccak256(abi.encodePacked(_gitUrl));
        bytes32 tokenHash = keccak256(abi.encodePacked(_tokenId));
        return keccak256(abi.encodePacked(tokenHash, gitHash, _blockHash));

    }

}