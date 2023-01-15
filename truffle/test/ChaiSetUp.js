"use strict";
var chai=require("chai");
const BN=web3.utils.BN;
const chaiBn=require("chai-BN")(BN);
chai.use(chaiBn);

var chaiAsPromised=require("chai-as-promised");
chai.use(chaiAsPromised);

module.exports=chai;