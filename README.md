## Project Dependency
* openzeppelin
* metamask (For the web front end)
* http-server (For running the web front end locally)

## Deploy smart contract on a public test network (Rinkeby)
### Using Truffle framework, deploy your smart contract with the Rinkeby test network. 

* tx hash: 0x58b7c19b2315c84d444da73a0ab4f4bba13b3d9066d5a316dd2dca7d91d27ac7
* address: 0x7698B90080804c8cd375bE366E901F2728a8B92B.

### Execute createStar() function and take note of transaction hash & tokenId

* tx hash: 0xc1f337780e08d1092e200e8ddebb031787da3fcac0ab32a8a9ac3fe3bc9ac11b 
* token id: 4

### Place your star for sale using putStarUpForSale() function

* tx hash : 0xb522cf494e276eff7ba63f571ffe5d6d7fa5bce91f86f89c81fd1933fefd1415


## Web Front End
### Claim a new star. Each new star support these pieces of metadata:

Enter the star name, coordinate and story in the corresponding input box and then click "Create Star". The star id will be shown in an alert box after the transaction has been confirmed.

### Lookup a star by ID using tokenIdToStarInfo()

Enter the token id in the tokenId input box and click "CheckStar". The star info will be populated in the corresponding input box. In addition to star name, coordinate and story, the owner of the star and the price of the star (0 indicate not for sale) are also shown.


## Missing Truffle.js

Truffle.js is ommitted intentionally to hide the mnemonic for my wallet.