const Token = artifacts.require("MyToken");
const TokenSale = artifacts.require("MyTokenSale");
const KycContract = artifacts.require("KycContract");
require("dotenv").config({path: "../.env"});

const chai = require("./setupchai.js");
const BN = web3.utils.BN;

const expect = chai.expect;

contract("TokenSale Test", async accounts => {

    const [ initialHolder, recipient, anotherAccount ] = accounts;

    it("should not have any tokens in deployerAccount", async() => {
        let instance = await Token.deployed();
        return expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it("all the tokens should be in the TokenSale smart contract by default", async() => {
        let instance = await Token.deployed();
        let balanceOfTokenSale = await instance.balanceOf(TokenSale.address);
        let totalSupply = await instance.totalSupply();
        return expect(balanceOfTokenSale).to.be.a.bignumber.equal(totalSupply);
    });

    it("should be possible to buy tokens", async() => {
        let instanceToken = await Token.deployed();
        let instanceTokenSale = await TokenSale.deployed();
        let instanceKyc = await KycContract.deployed();
        let balanceBefore = await instanceToken.balanceOf(initialHolder);
        await instanceKyc.setKycCompleted(initialHolder, {from: initialHolder});
        await expect(instanceTokenSale.sendTransaction({from: initialHolder, value: web3.utils.toWei("1","wei")})).to.be.fulfilled;
        return expect(instanceToken.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(balanceBefore.add(new BN(1)));

    });

})