pragma solidity ^0.4.24;

//import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-solidity/master/contracts/token/ERC721/ERC721.sol";
//import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-solidity/master/contracts/token/ERC721/ERC721Mintable.sol";

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-solidity/contracts/access/roles/MinterRole.sol";


contract StarNotary is ERC721, MinterRole  { 
    uint256 public tokenCounter;

    struct Star { 
        string name; 
        int256 dec;
        int256 mag;
        int256 cent;
        string story;
    }

    mapping(bytes32 => uint256) starHash;
    mapping(uint256 => Star) public tokenIdToStarInfo; 
    mapping(uint256 => uint256) public starsForSale;

    function createStar(string _name, int256 _dec, int256 _mag, int256 _cent, string _story) public { 
        Star memory newStar = Star(_name, _dec, _mag, _cent, _story);
        bytes32 hash = keccak256(abi.encodePacked(_dec, _mag, _cent));
        require(starHash[hash]==0,"star has been created before.");
        uint256 _tokenId = ++tokenCounter;
        starHash[hash] = _tokenId;
        tokenIdToStarInfo[_tokenId] = newStar;

        _mint(msg.sender, _tokenId);
        
    }
    function mint(address to, string _name, int256 _dec, int256 _mag, int256 _cent, string _story) public onlyMinter{
        Star memory newStar = Star(_name, _dec, _mag, _cent, _story);
        bytes32 hash = keccak256(abi.encodePacked(_dec, _mag, _cent));
        require(starHash[hash]==0,"star has been created before.");
        uint256 _tokenId = ++tokenCounter;
        starHash[hash] = _tokenId;
        tokenIdToStarInfo[_tokenId] = newStar;

        _mint(to, _tokenId);
    }

    /*
    *Allow changing price before the star is sold.
    */
    function putStarUpForSale(uint256 _tokenId, uint256 _price) public { 
        require(this.ownerOf(_tokenId) == msg.sender);
        require(_price > 0);

        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable { 
        require(starsForSale[_tokenId] > 0);
        
        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);
        emit Transfer(starOwner, msg.sender, _tokenId);
        delete starsForSale[_tokenId];
        starOwner.transfer(starCost);

        if(msg.value > starCost) { 
            msg.sender.transfer(msg.value - starCost);
        }
    }
    function checkIfStarExist(int256 _dec, int256 _mag, int256 _cent) public view returns (bool){
        bytes32 hash = keccak256(abi.encodePacked(_dec, _mag, _cent));
        return starHash[hash]>0;
    }
}