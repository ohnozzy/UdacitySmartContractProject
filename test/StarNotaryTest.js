const StarNotary = artifacts.require('StarNotary')

contract('StarNotary', accounts => { 

    beforeEach(async function() { 
        this.contract = await StarNotary.new({from: accounts[0]})
    })
    
    describe('can create a star', () => { 
        it('can create a star and get its name', async function () { 
            var tokenId = await this.contract.tokenCounter();
            await this.contract.createStar('Awesome Star!', 10, 10, 10, 'Good Story', {from: accounts[0]})
            tokenId = tokenId + 1;
            var astar = await this.contract.tokenIdToStarInfo(tokenId);            
            assert.equal(astar[0], 'Awesome Star!');
            assert.equal(astar[1].toNumber(), 10);
            assert.equal(astar[2].toNumber(), 10);
            assert.equal(astar[3].toNumber(), 10);
            assert.equal(astar[4], 'Good Story');
        })
    })

    describe('checkStarExists', () => { 
        it('return true when 3 coordinate match else false', async function () { 
            await this.contract.createStar('Awesome Star!', 10, 10, 10, 'Good Story', {from: accounts[0]})
            var result = await this.contract.checkIfStarExist(10, 10, 10);
            assert.isTrue(result);
            result = await this.contract.checkIfStarExist(20, 20, 20);
            console.log(result);
            assert.isNotTrue(result);
        })
    })

    describe('buying and selling stars', () => { 

        let user1 = accounts[1]
        let user2 = accounts[2]

        let starId = 1
        let starPrice = web3.toWei(.01, "ether")

        beforeEach(async function () {
            var tokenId = await this.contract.tokenCounter();
            await this.contract.createStar('awesome star', tokenId, tokenId, tokenId, 'good star', {from: user1})
            starId = tokenId.toNumber() + 1;
        })

        describe('user1 can sell a star', () => { 
            it('user1 can put up their star for sale', async function () { 
                await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
            
                assert.equal(await this.contract.starsForSale(starId), starPrice)
            })

            it('user1 gets the funds after selling a star', async function () { 
                let starPrice = web3.toWei(.05, 'ether')
                
                await this.contract.putStarUpForSale(starId, starPrice, {from: user1})

                let balanceOfUser1BeforeTransaction = web3.eth.getBalance(user1)
                await this.contract.buyStar(starId, {from: user2, value: starPrice})
                let balanceOfUser1AfterTransaction = web3.eth.getBalance(user1)

                assert.equal(balanceOfUser1BeforeTransaction.add(starPrice).toNumber(), 
                            balanceOfUser1AfterTransaction.toNumber())
            })
        })

        describe('user2 can buy a star that was put up for sale', () => { 
            beforeEach(async function () { 
                await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
            })

            it('user2 is the owner of the star after they buy it', async function () { 
                await this.contract.buyStar(starId, {from: user2, value: starPrice})

                assert.equal(await this.contract.ownerOf(starId), user2)
            })

            it('user2 correctly has their balance changed', async function () { 
                let overpaidAmount = web3.toWei(.05, 'ether')

                const balanceOfUser2BeforeTransaction = web3.eth.getBalance(user2)
                await this.contract.buyStar(starId, {from: user2, value: overpaidAmount, gasPrice:0})
                const balanceAfterUser2BuysStar = web3.eth.getBalance(user2)

                assert.equal(balanceOfUser2BeforeTransaction.sub(balanceAfterUser2BuysStar), starPrice)
            })
        })
    })
})