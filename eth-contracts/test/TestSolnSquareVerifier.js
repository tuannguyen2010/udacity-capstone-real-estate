

const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
const Verifier = artifacts.require("Verifier");
const proofJson = require("./../../zokrates/zokrates/code/proof.json");

contract('TestSolnSquareVerifier', accounts => {
    const account_one = accounts[0];
    const account_two = accounts[1];
    const inputs = proofJson.inputs;
    const proof = proofJson.proof;
    describe('SolnSquareVerifier', function () {
        beforeEach(async function () { 
            this.verifier = await Verifier.new({from: account_one});
            this.contract = await SolnSquareVerifier.new(this.verifier.address, {from: account_one});
            
        })
        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('should add solution success', async function () {
            try {
                // this.verifier = await Verifier.new();
                // console.log(this.verifier.address);
                // this.contract = await SolnSquareVerifier.new(this.verifier.address, {from: account_one});
                await this.contract.add(proof.a, proof.b, proof.c, inputs, { from: account_one });
                await this.contract.add(proof.a, proof.b, proof.c, inputs);
            } catch(e) {
                assert.equal(e.message.includes("revert"), true, "Add solution failed");
            }
        })
        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('should mint success', async function () {
            try {
                this.verifier = await Verifier.new();
                this.contract = await SolnSquareVerifier.new(this.verifier.address, {from: account_one});
                await this.contract.add(proof.a, proof.b, proof.c, inputs);
                await this.contract.mint(account_two, 1, inputs);
                let balance = await this.contract.balanceOf(account_two);
                assert.equal(balance, 1, "Incorrect total balance");
            } catch(e) {
                assert.fail("Mint failed");
            }
        })
    });
}); 