// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "openzeppelin-contracts/access/AccessControl.sol";
import "openzeppelin-contracts/utils/cryptography/ECDSA.sol";
import "openzeppelin-contracts/utils/cryptography/draft-EIP712.sol";

interface IXPToken {
    function mint(address to, uint256 amount) external;
}

interface IChapterNFT {
    function mintTo(address to) external returns (uint256);
}

/// @title GameCore
/// @notice Verifies off-chain signed progress vouchers (EIP-712), records progress, awards XP, and enables NFT minting when chapter completed.
contract GameCore is EIP712, AccessControl {
    using ECDSA for bytes32;

    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;

    IXPToken public xpToken;
    IChapterNFT public chapterNft;

    // domain name, version for EIP-712
    string private constant NAME = "QuestEthGame";
    string private constant VERSION = "1";

    // progress mapping: user => questId => progress (0-100)
    mapping(address => mapping(uint256 => uint256)) public progress;
    mapping(address => mapping(uint256 => bool)) public completed;

    // nonces used per user
    mapping(address => mapping(uint256 => bool)) public usedNonces;

    address public rewardSigner;

    event ProgressClaimed(address indexed user, uint256 indexed questId, uint256 progressValue, uint256 xpAwarded);
    event ChapterCompleted(address indexed user, uint256 indexed chapterId, uint256 tokenId);

    // EIP-712 typehash
    bytes32 public constant PROGRESS_TYPEHASH = keccak256("Progress(address user,uint256 questId,uint256 progress,uint256 xp,uint256 nonce,uint256 expiry)");

    constructor(address xpToken_, address chapterNft_, address signer_) EIP712(NAME, VERSION) {
        xpToken = IXPToken(xpToken_);
        chapterNft = IChapterNFT(chapterNft_);
        rewardSigner = signer_;
        _setupRole(ADMIN_ROLE, msg.sender);
    }

    function setRewardSigner(address s) external onlyRole(ADMIN_ROLE) {
        rewardSigner = s;
    }

    function setXPToken(address t) external onlyRole(ADMIN_ROLE) {
        xpToken = IXPToken(t);
    }

    function setChapterNFT(address n) external onlyRole(ADMIN_ROLE) {
        chapterNft = IChapterNFT(n);
    }

    /// @notice Claim progress using an off-chain signed voucher
    function claimProgress(
        address user,
        uint256 questId,
        uint256 progressValue,
        uint256 xp,
        uint256 nonce,
        uint256 expiry,
        bytes calldata signature
    ) external {
        require(block.timestamp <= expiry, "Voucher expired");
        require(!usedNonces[user][nonce], "Nonce used");

        bytes32 structHash = keccak256(abi.encode(PROGRESS_TYPEHASH, user, questId, progressValue, xp, nonce, expiry));
        bytes32 hash = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(hash, signature);
        require(signer == rewardSigner, "Invalid signer");

        usedNonces[user][nonce] = true;

        // update progress to max(current, progressValue)
        uint256 prev = progress[user][questId];
        if (progressValue > prev) {
            progress[user][questId] = progressValue;
        }

        // award xp (mint)
        if (xp > 0) {
            xpToken.mint(user, xp);
        }

        // if progress reaches or exceeds 100, mark as completed
        if (progress[user][questId] >= 100) {
            completed[user][questId] = true;
        }

        emit ProgressClaimed(user, questId, progressValue, xp);
    }

    /// @notice Mint chapter NFT if the user has completed the corresponding quest/chapter
    function mintChapter(uint256 chapterId) external returns (uint256) {
        require(completed[msg.sender][chapterId], "Chapter not completed");
        uint256 tokenId = chapterNft.mintTo(msg.sender);
        emit ChapterCompleted(msg.sender, chapterId, tokenId);
        return tokenId;
    }

    // helper for frontend to check multiple quests
    function isCompleted(address user, uint256 questId) external view returns (bool) {
        return completed[user][questId];
    }
}
