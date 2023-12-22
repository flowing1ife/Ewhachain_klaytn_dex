const CONTRACT_ADDRESS = "위에서 바오밥 테스트넷에 배포한 컨트랙트 주소"

async function getBalance(contractAddress) {
    const EwhachainBank = await ethers.getContractFactory("EwhachainBank") // EwhachainBank 컨트랙트를 인스턴스를 생성
    const [owner] = await ethers.getSigners() // 내 account 정보 불러오기 => 내 private key로 sign 하기 때문에 signer는 나의 account
    const ownerBalance = await EwhachainBank.attach(contractAddress).getBalance(owner.address); // 위에 배포된 EwhachainBank 컨트랙트 주소에 나의 account balance 가지고 옴
    console.log("ownerBalance : ", ownerBalance); // owner balance 출력
}

getBalance(CONTRACT_ADDRESS)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });