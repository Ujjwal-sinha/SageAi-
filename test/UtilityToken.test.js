const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UtilityToken Contract", function () {
  let UtilityToken;
  let utilityToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  const initialSupply = ethers.parseUnits("1000000", 18); // bigint

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    UtilityToken = await ethers.getContractFactory("UtilityToken");
    utilityToken = await UtilityToken.deploy(initialSupply);
    await utilityToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await utilityToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await utilityToken.balanceOf(owner.address);
      expect(await utilityToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the correct token name and symbol", async function () {
      expect(await utilityToken.name()).to.equal("UtilityToken");
      expect(await utilityToken.symbol()).to.equal("UTK");
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.parseUnits("50", 18); // bigint
      
      // Transfer from owner to addr1
      await utilityToken.transfer(addr1.address, transferAmount);
      expect(await utilityToken.balanceOf(addr1.address)).to.equal(transferAmount);

      // Transfer from addr1 to addr2
      await utilityToken.connect(addr1).transfer(addr2.address, transferAmount);
      expect(await utilityToken.balanceOf(addr2.address)).to.equal(transferAmount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await utilityToken.balanceOf(owner.address);
      
      await expect(
        utilityToken.connect(addr1).transfer(owner.address, 1n)
      ).to.be.revertedWithCustomError(utilityToken, "ERC20InsufficientBalance");

      expect(await utilityToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });

    it("Should update balances after transfers", async function () {
      const transferAmount = ethers.parseUnits("100", 18);
      const initialOwnerBalance = await utilityToken.balanceOf(owner.address);

      await utilityToken.transfer(addr1.address, transferAmount);
      await utilityToken.transfer(addr2.address, transferAmount);

      const ownerBalanceAfter = await utilityToken.balanceOf(owner.address);
      // Use native BigInt math here
      expect(ownerBalanceAfter).to.equal(initialOwnerBalance - transferAmount * 2n);
      expect(await utilityToken.balanceOf(addr1.address)).to.equal(transferAmount);
      expect(await utilityToken.balanceOf(addr2.address)).to.equal(transferAmount);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint new tokens", async function () {
      const mintAmount = ethers.parseUnits("1000", 18);
      await utilityToken.mint(addr1.address, mintAmount);
      
      expect(await utilityToken.balanceOf(addr1.address)).to.equal(mintAmount);
      expect(await utilityToken.totalSupply()).to.equal(initialSupply + mintAmount);
    });

    it("Should prevent non-owners from minting", async function () {
      const mintAmount = ethers.parseUnits("1000", 18);
      await expect(
        utilityToken.connect(addr1).mint(addr1.address, mintAmount)
      ).to.be.revertedWithCustomError(utilityToken, "OwnableUnauthorizedAccount");
    });

    it("Should emit Transfer event when minting", async function () {
      const mintAmount = ethers.parseUnits("500", 18);
      await expect(utilityToken.mint(addr1.address, mintAmount))
        .to.emit(utilityToken, "Transfer")
        .withArgs(ethers.ZeroAddress, addr1.address, mintAmount);
    });
  });

  describe("Burning", function () {
    it("Should allow token holders to burn their tokens", async function () {
      const transferAmount = ethers.parseUnits("1000", 18);
      const burnAmount = ethers.parseUnits("500", 18);

      // First transfer tokens to addr1
      await utilityToken.transfer(addr1.address, transferAmount);

      // Then burn some from addr1
      await utilityToken.connect(addr1).burn(burnAmount);
      
      expect(await utilityToken.balanceOf(addr1.address))
        .to.equal(transferAmount - burnAmount);
      expect(await utilityToken.totalSupply())
        .to.equal(initialSupply - burnAmount);
    });

    it("Should prevent burning more tokens than balance", async function () {
      await expect(
        utilityToken.connect(addr1).burn(1n)
      ).to.be.revertedWithCustomError(utilityToken, "ERC20InsufficientBalance");
    });

    it("Should emit Transfer event when burning", async function () {
      const transferAmount = ethers.parseUnits("300", 18);
      const burnAmount = ethers.parseUnits("100", 18);

      await utilityToken.transfer(addr1.address, transferAmount);
      
      await expect(utilityToken.connect(addr1).burn(burnAmount))
        .to.emit(utilityToken, "Transfer")
        .withArgs(addr1.address, ethers.ZeroAddress, burnAmount);
    });
  });
});
