// migrating the appropriate contracts
//var Verifier = artifacts.require("../../zokrates/code/square/verifier.sol");
var Verifier = artifacts.require('Verifier');
var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
//var ERC721Mintable = artifacts.require("./ERC721Mintable.sol");


module.exports = function(deployer) {
  deployer.deploy(Verifier).then(() => {
    return deployer.deploy(SolnSquareVerifier, Verifier.address);
    //deployer.deploy(ERC721Mintable, "Udacity Real Estate", "URS", "UrsURI");
    //deployer.deploy(ERC721Mintable);
  });
  
};
