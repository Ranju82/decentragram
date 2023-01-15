const Detragram = artifacts.require("Detragram");

const { assert } = require("chai");
const chai=require("./ChaiSetUp.js");
const BN=web3.utils.BN;
const expect=chai.expect;

contract('Detragram', async(accounts) => {
  
  it('deployed successfully', async() => {
    const address=await Detragram.address
    assert.notEqual(address,0x0)
    assert.notEqual(address,'')
    assert.notEqual(address,null)
    assert.notEqual(address,undefined)
  });

  it('has a name',async()=>{
    const detragram=await Detragram.deployed()
    const name=await detragram.name()
    assert.equal(name,'Detragram')
  });

  it('upload image',async()=>{
    const detragram=await Detragram.deployed()
    let result=await detragram.uploadImage("abc123",'Image description',{from:accounts[0]})
    let imageCount=await detragram.imageCount()
    const event=result.logs[0].args
    expect(imageCount).to.be.a.bignumber.equal(new BN(1))
    expect(event.id).to.be.a.bignumber.equal(imageCount)
    expect(event.hash).to.equal('abc123')
    expect(event.description).to.equal('Image description')
    expect(event.tipAmount).to.be.a.bignumber.equal(new BN(0))
    expect(event.author).to.be.a.bignumber.equal(accounts[0])

    await expect(detragram.uploadImage("",'Image description',{from:accounts[0]})).to.be.rejected
    await expect(detragram.uploadImage("abc123",'',{from:accounts[0]})).to.be.rejected;
  });

  it('list images',async()=>{
    const detragram=await Detragram.deployed()
    let imageCount=await detragram.imageCount()
    const image=await detragram.images(imageCount)
    expect(image.id).to.be.a.bignumber.equal(imageCount)
    expect(image.hash).to.equal('abc123')
    expect(image.description).to.equal('Image description')
    expect(image.tipAmount).to.be.a.bignumber.equal(new BN(0))
    expect(image.author).to.be.a.bignumber.equal(accounts[0])
  });

  it('allow user to tip image',async()=>{
    const detragram=await Detragram.deployed()
    let imageCount=await detragram.imageCount()
    let oldAuthorBal
    oldAuthorBal=await web3.eth.getBalance(accounts[0])
    oldAuthorBal=new web3.utils.BN(oldAuthorBal)

    let result=await detragram.tipImageOwner(imageCount,{from:accounts[2],value:web3.utils.toWei('1','Ether')})
    const event=result.logs[0].args
    expect(event.id).to.be.a.bignumber.equal(imageCount)
    expect(event.hash).to.equal('abc123')
    expect(event.description).to.equal('Image description')
    expect(event.tipAmount).to.be.a.bignumber.equal('1000000000000000000')
    expect(event.author).to.be.a.bignumber.equal(accounts[0])

    let newAuthorBal;
    newAuthorBal=await web3.eth.getBalance(accounts[0])
    newAuthorBal=new web3.utils.BN(newAuthorBal)

    let tipImageOwner
    tipImageOwner=await web3.utils.toWei('1','Ether')
    tipImageOwner=new web3.utils.BN(tipImageOwner)

    const expectedBalance=oldAuthorBal.add(tipImageOwner)
    expect(newAuthorBal.toString()).to.equal(expectedBalance.toString())
    await expect(detragram.tipImageOwner(99,{from:accounts[2],value:web3.utils.toWei('1','Ether')})).to.be.rejected;
  });
});
