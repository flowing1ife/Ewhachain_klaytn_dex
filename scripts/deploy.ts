import { ethers } from "hardhat";

async function main() {
//   We get the contract to deploy
    const EwhachainBank = await ethers.getContractFactory("EwhachainBank"); //EwhachainBank 컨트랙트를 가져와서 EwhachainBank 변수에 담음
    const ewhachainbank = await EwhachainBank.deploy(); // deploy 함수를 통해 EwhachainBank 컨트랙트를 배포, 그리고 다음의 배포하는 트랜잭션을 ewhachainbank 변수에 담음
    await ewhachainbank.deployed(); // deployed 함수를 통해 EwhachainBank 컨트랙트가 배포되었는지 확인
    console.log("EwhachainBank deployed to:", ewhachainbank.address); // 배포된 EwhachainBank 컨트랙트 주소를 출력
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});