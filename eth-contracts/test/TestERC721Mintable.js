var ERC721Mintable = artifacts.require('ERC721Mintable');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    const baseURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";
    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new({from: account_one});
            
            // TODO: mint multiple tokens
            await this.contract.mint(account_two, 1);
            await this.contract.mint(account_two, 2);
            await this.contract.mint(account_two, 3);
        })

        it('should return total supply', async function () { 
            let total = await this.contract.totalSupply.call();
            assert.equal(total, 3, "Incorrect total supply");
        })

        it('should get token balance', async function () { 
            let balance = await this.contract.balanceOf(account_two);
            assert.equal(balance, 3, "Incorrect total balance");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokenURI = await this.contract.tokenURI(1);
            assert.equal(baseURI + 1, tokenURI, "Incorrect tokenURI");
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.approve(account_three, 1, {from: account_two});
            await this.contract.transferFrom(account_two, account_three, 1 , { from: account_two });

            let getOwner = await this.contract.ownerOf(1);
            assert.equal(getOwner, account_three, "Cannot transfer: wrong address");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            try {
                
                let success = await this.contract.mint(account_three, 4, { from: account_two});
            } catch(e) {
                assert.equal(e.message.includes("revert"), true , "Should failed");
            }
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.owner.call();
            assert.equal(owner, account_one, "Not return owner");
        })

    });
})