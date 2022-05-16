"use strict";

var chai = require("chai");
const BN = web3.utils.BN;
const chaiBN = require('chai-bn')(BN);
chai.use(chaiBN);

var chaisAsPromised = require("chai-as-promised");
const { builtinModules } = require("module");
const { send } = require("process");
chai.use(chaisAsPromised);


module.exports = chai;