const Token = artifacts.require("MyToken");
require("dotenv").config({path: "../.env"});

const chai = require("./setupchai.js");
const BN = web3.utils.BN;

const expect = chai.expect;

contract("Token Test", async accounts => {

    const [ initialHolder, recipient, anotherAccount ] = accounts;

    beforeEach(async() => {
        this.myToken = await Token.new(process.env.INITIAL_TOKENS);
    }) 


    it("all tokens should be in my account", async () => {
        let instance = this.myToken;    //Earlier was let instance = await Token.deployed();
        let totalSupply = await instance.totalSupply();
        //let balance = await instance.balanceOf(accounts[0]);
        //assert.equal(balance.valueOf(), initialSupply.valueOf(), "The balance was not the same");
        return expect( instance.balanceOf(initialHolder)).to.be.eventually.a.bignumber.equal(totalSupply);
    });

    it("is not possible to send more tokens than available in total", async() => {
        let instance = this.myToken;
        let balanceOfInitialHolder = await instance.balanceOf(initialHolder);
        await expect(instance.transfer(recipient, new BN(balanceOfInitialHolder+1))).to.eventually.be.rejected;
        return expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(balanceOfInitialHolder);
    });

    it("is possible to send tokens between the accounts", async() => {
        const sendTokens = 1;
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
        await expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled;
        await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
        return expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));

    });

})