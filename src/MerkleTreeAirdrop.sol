// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;
import "@openzeppelin/contracts-upgradeable/utils/cryptography/MerkleProofUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract MerkleTreeAirdrop is OwnableUpgradeable {
    event Claim(address user, uint256 amount);
    struct VerifiableData {
        address owner;
        uint256 value;
    }

    mapping(address => bool) public isClaimed;

    bytes32 committedRoot;

    // Initialization

    function initialize() external initializer {
        __Ownable_init();
    }

    function setCommittedRoot(bytes32 _root) external onlyOwner {
        committedRoot = _root;
    }

    // STATE MODIFIERS
    function claim(bytes32[] memory proof, VerifiableData memory data)
        external
    {
        require(
            canClaim(proof, keccak256(abi.encode(data))),
            "Invalid proof or already claimed"
        );

        isClaimed[data.owner] = true;

        emit Claim(data.owner, data.value);
    }

    // VIEWS
    function canClaim(bytes32[] memory proof, bytes32 leaf)
        public
        view
        returns (bool)
    {
        return
            !isClaimed[_msgSender()] &&
            MerkleProofUpgradeable.verify(proof, committedRoot, leaf);
    }
}
