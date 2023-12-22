# Ewhachain_klaytn_dex
## What are we building ?
Klay를 예치하고 출금하며, 잔액을 조회할 수 있는 컨트랙트를 작성하여 hardhat으로 테스트 해보고 직접 바오밥 테스트넷에 배포해 볼 예정입니다.
## Welcome 🙌
1. git 복제
```
git clone https://github.com/flowing1ife/Ewhachain_klaytn_dex.git
```
2. npm 설치
```
npm install
```
## Build 💻

1. root 폴더에 .env 파일 생성하여 작성 
```
KLAYTN_URL='https://api.baobab.klaytn.net:8651'
PRIVATE_KEY=카이카스 지갑의 개인키를 넣어주세요.
```
2. hardhat.config.ts 수정
3. contracts/EwhachainBank.sol 작성 후 컴파일
```
npx hardhat compile
```
4. scripts/deploy.ts 작성
5. local에서 컨트랙트 테스트
   1. local node 돌리기
   ```
    npx hardhat node
    ```
   2. 새로운 터미널을 열어서 작성한 컨트랙트 배포
   ```
    npx hardhat run scripts/deploy.ts --network localhost
    ```
   3. test/index.ts 에서 테스트 코드 작성
   4. local에서 테스트 돌리기
   ```
    npx hardhat test test/index.ts --network localhost
    ```
6. 클레이튼 테스트넷에 배포
```
npx hardhat run scripts/deploy.ts --network klaytn
```
7. 실제 함수 실행
   1. script/deposit.mjs 작성 후 실행
   ```
   npx hardhat run scripts/deposit.mjs --network klaytn
   ```
   2. script/getBalance.mjs 작성 후 실행
   ```
   npx hardhat run scripts/getBalance.mjs --network klaytn
   ```
   3. script/withdraw.mjs 작성 후 실행
   ```
   npx hardhat run scripts/withdraw.mjs --network klaytn
   ```
   
## Reference
- https://velog.io/@thyoondev/하드햇Hardhat에서-클레이튼Klaytn-배포하기
- https://oxpampam.hashnode.dev/how-to-set-up-a-hardhat-project-for-klaytn