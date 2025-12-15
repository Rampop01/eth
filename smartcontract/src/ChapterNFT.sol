// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "openzeppelin-contracts/token/ERC721/ERC721.sol";
import "openzeppelin-contracts/access/AccessControl.sol";
import "openzeppelin-contracts/utils/Counters.sol";

/// @title ChapterNFT
/// @notice ERC721 contract for Chapter completion NFTs. `MINTER_ROLE` allowed to mint.
contract ChapterNFT is ERC721, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    string public baseURI;

    constructor(string memory name_, string memory symbol_, string memory baseURI_) ERC721(name_, symbol_) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        baseURI = baseURI_;
    }

    function setBaseURI(string calldata uri) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURI = uri;
    }

    function mintTo(address to) external onlyRole(MINTER_ROLE) returns (uint256) {
        _tokenIdCounter.increment();
        uint256 tid = _tokenIdCounter.current();
        _safeMint(to, tid);
        return tid;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Not exist");
        return string(abi.encodePacked(baseURI, _toString(tokenId)));
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        // OpenZeppelin's toString is in Strings library; keep minimal here to avoid extra import
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
