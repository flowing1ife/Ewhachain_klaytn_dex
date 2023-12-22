// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract EwhachainBank {
    mapping(address => uint) public balances; // user 주소 별로 balance를 저장해두는 변수

    //어떠한 함수가 작동했을 때 다음의 event를 출력해줌
    event depositEvent(uint _amount, address _depositor); // deposit 함수가 실행됐을 때 출력되는 event
    event withdrawEvent(uint _amount, address _depositor, address _beneficiary); // withdraw 함수가 실행됐을 때 출력되는 event

    receive() external payable {} // receive 함수가 있어야 native token을 이 컨트랙트에 받을 수 있음, 현재의 경우 native token은 klay

    /**
     * @notice klay를 이 컨트랙트에 예치하는 함수
     * @dev klay를 받으면 받은 value 만큼 해당 주소의 balance를 증가해줌
     **/
    function deposit() public payable {
        require(msg.value != 0, "EwhachainBank: Deposit amount cannot be Zero"); // native token의 경우, msg.value로 user가 보낸 value를 표기함, 예치하는 수량이 0일 경우, 굳이 이 함수를 실행할 이유가 없음
        balances[msg.sender] += msg.value; // 해당 주소의 balance를 예치한 수량 만큼 증가
        emit depositEvent(msg.value, msg.sender); // deposit event 실행 ( user가 예치한 klay 수량, user 주소 ) 표시
    }

    /**
     * @notice klay를 이 컨트랙트에서 출금하는 함수
     * @dev klay를 _recipient한테 _amount 만큼 전달해줌
     * @param _recipient 출금 되는 klay를 받는 주소
     * @param _amount 출금하려는 klay 수량
     **/
    function withdraw(address _recipient, uint _amount) public {
        require(_recipient != address(0) ,"EwhachainBank: Cannot Send to Address Zero"); // address(0)는 native token의 주소로 보통 지갑 주소가 아니기에 보낼 수 없도록 해야 함
        require(_amount <= balances[msg.sender], "EwhachainBank: Insufficient Balance"); // msg.sender, 즉 이 함수를 호출하는 자가 예치한 수량 보다 많은 수량을 출력할 수 없도록 해야 함

        balances[msg.sender] -= _amount; // 해당 주소의 balance를 출금하는 수량만큼 감소
        _safeTransferETH(_recipient, _amount); // 출금하는 수량만큼 klay를 전달하고자 하는 사람에게 전달

        emit withdrawEvent(_amount, msg.sender, _recipient); // withdraw event 실행 ( user가 출금한 klay 수량, user 주소, 출금한 klay를 받는 주소 ) 표시
    }

    /**
     * @notice 해당 주소의 balance를 보여주는 함수
     * @param _addr balance를 보려는 주소
     * @return uint 해당 주소의 잔액
     **/
    function getBalance(address _addr) public view returns(uint) {
        return balances[_addr]; // balances에서 정보를 가지고옴
    }

    /* ========== PRIVATE FUNCTIONS ========== */
    // native token을 컨트랙트가 전달해야 할 때는 다음처럼 low level call을 써서 전달함
    function _safeTransferETH(address to, uint256 value) internal {
        (bool success, ) = to.call{value: value}(new bytes(0));
        require(success, 'ETH_TRANSFER_FAILED');
    }

}