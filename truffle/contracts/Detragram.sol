//SPDX-License-Identifier:MIT

pragma solidity 0.8.17;

contract Detragram{
    string public name="Detragram";

    //store image
    uint public imageCount=0;
    mapping(uint=>Image) public images;

    struct Image{
        uint id;
        string hash;
        string description;
        uint tipAmount;
        address payable author;
    }

    event ImageCreated(
        uint id,
        string hash,
        string description,
        uint tipAmount,
        address payable author
        );

     event TipImage(
        uint id,
        string hash,
        string description,
        uint tipAmount,
        address payable author
        );    
    

    function uploadImage(string memory _imageHash,string memory _description) public{
        require(bytes(_imageHash).length>0,'Image is not valid');
        require(bytes(_description).length>0,'Description is empty');
        require(msg.sender!=address(0x0),'Address is not valid');

        imageCount+=1;

        images[imageCount]=Image(imageCount,_imageHash,_description,0,payable(msg.sender));

        emit ImageCreated(imageCount, _imageHash, _description, 0, payable(msg.sender));
    }

    function tipImageOwner(uint _id) public payable{
        require(_id>0 && _id<=imageCount);
        Image memory _image=images[_id];
        address payable _author=_image.author;
        _author.transfer(msg.value);
        _image.tipAmount=_image.tipAmount+msg.value;
        images[_id]=_image;

        emit TipImage(_id, _image.hash, _image.description, _image.tipAmount, _author);
    } 
}