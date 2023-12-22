import { expect } from 'chai';
import { ethers } from 'hardhat';
import { EwhachainBank } from '../typechain';

let ewhachainbank: EwhachainBank;

const deployedContract: string = '위에서 로컬에 배포한 주소를 붙여넣기';

describe('EwhachainBank의 인스턴스가 생성되어야 합니다.', function () {
    before(async function () {
        ewhachainbank = (await ethers.getContractAt(
            'EwhachainBank',
            deployedContract
        )) as EwhachainBank;
    });
    it('예금 시 사용자 잔액과 EwhachainBank의 클레이 수량이 증가해야 합니다.', async function () {
        const signer = await ethers.getSigners();
        const _depositor1 = signer[0].address;
        const _depositorSigner = await ethers.getSigner(_depositor1);

        const balance: any = await ewhachainbank.getBalance(_depositor1);
        const ewhachainbankBalanceBefore: any = await ethers.provider.getBalance(ewhachainbank.address);
        const option = { value: ethers.utils.parseEther('1') };

        const deposit: any = await ewhachainbank
            .connect(_depositorSigner)
            .deposit(option);
        const tx = await deposit.wait();
        const value = tx.events[0].args[0];
        const depositor = tx.events[0].args[1];

        const balanceAfter: any = await ewhachainbank.getBalance(_depositor1);
        const ewhachainbankBalanceAfter: any = await ethers.provider.getBalance(ewhachainbank.address);

        expect(Number(balance.toString()) + Number(value.toString())).to.equal(
            Number(balanceAfter.toString())
        );
        expect(Number(ewhachainbankBalanceBefore.toString()) + Number(value.toString())).to.equal(
            Number(ewhachainbankBalanceAfter.toString())
        );
        expect(_depositor1).to.equal(depositor);
    });

    it('출금시 사용자의 잔액과 EwhachainBank의 잔액은 감소해야 하며, recipient의 클레이 수량은 증가해야 합니다.', async function () {
        const signer = await ethers.getSigners();
        const _depositor1 = signer[0].address;
        const _depositorSigner = await ethers.getSigner(_depositor1);

        const balance: any = await ewhachainbank.getBalance(_depositor1);
        const recipientBalBefore: any = await ethers.provider.getBalance(signer[1].address);
        const ewhachainbankBalanceBefore: any = await ethers.provider.getBalance(ewhachainbank.address);

        const withdraw: any = await ewhachainbank
            .connect(_depositorSigner)
            .withdraw(signer[1].address, '5000000000');
        const tx = await withdraw.wait();
        const value = tx.events[0].args[0];
        const depositor = tx.events[0].args[1];
        const recipient = tx.events[0].args[2];

        const balanceAfter: any = await ewhachainbank.getBalance(_depositor1);
        const recipientBalAfter: any = await ethers.provider.getBalance(signer[1].address);
        const ewhachainbankBalanceAfter: any = await ethers.provider.getBalance(ewhachainbank.address);

        expect(Number(balance.toString()) - Number(value.toString())).to.be.closeTo(
            Number(balanceAfter.toString()),
            0.00001
        );
        expect(Number(recipientBalBefore.toString()) + Number(value.toString())).to.be.closeTo(
            Number(recipientBalAfter.toString()),
            0.00001
        );

        expect(Number(ewhachainbankBalanceBefore.toString()) - Number(value.toString())).to.be.closeTo(
            Number(ewhachainbankBalanceAfter.toString()),
            0.00001
        );
        expect(_depositor1).to.equal(depositor);
        expect(signer[1].address).to.equal(recipient);
    });

    it('계정 주소가 0인 계정으로 입금할 때 트랜잭션이 되돌려져야합니다.', async function () {
        const signer = await ethers.getSigners();
        const _depositor1 = signer[0].address;
        const _depositorSigner = await ethers.getSigner(_depositor1);

        await expect(
            ewhachainbank
                .connect(_depositorSigner)
                .withdraw(ethers.constants.AddressZero, '5000000000')
        ).to.be.revertedWith('EwhachainBank: Cannot Send to Address Zero');
    });

    it('이체 금액이 잔액보다 클 때 트랜잭션이 되돌려져야합니다.', async function () {
        const signer = await ethers.getSigners();
        const _depositor1 = signer[0].address;
        const _depositorSigner = await ethers.getSigner(_depositor1);

        const balanceB4: any = await ewhachainbank.getBalance(_depositor1);

        const balance: any = await ewhachainbank.getBalance(_depositor1);
        await expect(
            ewhachainbank
                .connect(_depositorSigner)
                .withdraw(signer[1].address, balance.toString() + '1000000')
        ).to.be.revertedWith('EwhachainBank: Insufficient Balance');
        expect(await ewhachainbank.getBalance(_depositor1)).to.equal(balanceB4);
    });
});