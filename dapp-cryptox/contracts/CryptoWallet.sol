// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CryptoWallet {
    mapping(address => uint256) private balances;
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    // Dépôt de fonds sur le contrat
    function deposit() external payable {
        require(msg.value > 0, unicode"Le montant doit être supérieur à 0");
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    // Consulter le solde d'un utilisateur
    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }

    // Retirer des fonds
    function withdraw(uint256 amount) external {
        require(amount > 0, unicode"Le montant doit être supérieur à 0");
        require(balances[msg.sender] >= amount, "Fonds insuffisants");

        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawn(msg.sender, amount);
    }
}
