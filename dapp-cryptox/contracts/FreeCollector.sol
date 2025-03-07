// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract FreeCollector {
    using SafeERC20 for IERC20;

    address public owner;
    uint256 public balance;
    IERC20 public token;

    event Withdrawn(address indexed user, uint256 amount);
    event TransferReceived(address _from, uint256 _amount);
    event TransferSent(address _from, address _to, uint256 _amount);

    constructor(address _token) {
        owner = msg.sender;
        token = IERC20(_token);
    }

    receive() payable external {
        balance += msg.value;
        emit TransferReceived(msg.sender, msg.value);
    }

    function withdraw(uint256 amount, address payable destAddr) public {
        require(msg.sender == owner, "Only owner can withdraw funds!");
        require(amount <= balance, "Insufficient funds!");

        destAddr.transfer(amount);
        balance -= amount;
        emit TransferSent(msg.sender, destAddr, amount);
    }

    function transferERC20(IERC20 _token, address to, uint256 amount) public {
        require(msg.sender == owner, "Only owner can transfer !");
        // _token.safeTransfer(to, amount);
        uint256 erc20balance = _token.balanceOf(address(this));
        require(erc20balance >= amount, "Insufficient balance");
        _token.transfer(to, amount);
        emit TransferSent(msg.sender, to, amount);
    }
}