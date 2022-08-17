const SolnSquareVerifier = require('../../eth-contracts/build/contracts/SolnSquareVerifier.json');
const Web3 = require('web3');
const proofJson = require("../../zokrates/zokrates/code/proof.json");
const API_KEY = ""
const PRIVATE_KEY = ""
const CONTRACT_ADDRESS = "";
const infuraKey = "";
API_URL = `https://rinkeby.infura.io/v3/${infuraKey}`;




async function main() {
    const web3 = new Web3(new Web3.providers.HttpProvider(API_URL));
    accounts = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
    console.log(accounts);
    const account_one = accounts.address;
    const input = proofJson.inputs;
    const contractInstance = new web3.eth.Contract(SolnSquareVerifier.abi, "");
    // const res = await contractInstance.methods.balanceOf(accounts.address).call();
    // console.log(res);
    const wallet = web3.eth.accounts.wallet;
    const signer = web3.eth.accounts.sign("Mint NFT", PRIVATE_KEY);
    const res2 = await contractInstance.methods.mint(account_one, 1, input).send({from: account_one, gasPrice: "0xFF", gasLimit: "0x24A22"});
    //console.log("Obtained value at deployed contract is: "+ res);
    // Signer
    // const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

    // // Contract
    // const helloWorldContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
}

main();