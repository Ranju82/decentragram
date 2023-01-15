import React, {useEffect, useState} from "react";
import useEth from "../contexts/EthContext/useEth";
import Image from "./Image";
const Web3 = require('web3');
require('dotenv').config({ path: '../../.env'});
 
const ipfsClient=require("ipfs-http-client");

const auth = 'Basic ' + Buffer.from(process.env.PROJECT_ID + ':' + process.env.PROJECT_SECRET).toString('base64');

const client = ipfsClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});


function Content(){
    const { state: { contract, accounts } } = useEth();
    const [loading,setLoading]=useState(true);
    const  [images,setImages]=useState([]);


    const [data,setData]=useState({
      description:"",
      buffer:null
    });

    const displayImages=async()=>{
     
      const count=await contract.methods.imageCount().call();
     
      for(var i=1;i<=count;i++){
        const image=await contract.methods.images(i).call();
        setImages(prevValue=>{
          return [...prevValue,image];
        });
      }
      console.log(images.length);
    }

    const addImages=async()=>{
      const count=await contract.methods.imageCount().call();
      const image=await contract.methods.images(count).call();
      setImages(prevValue=>{
        return [...prevValue,image];
      });
    }
    
    useEffect(() => {
        if(accounts!=null && contract!=null){
            displayImages();
            setLoading(false);
        }
      },[accounts,contract]);


      const captureFile=(event)=>{
        event.preventDefault();
        const file=event.target.files[0];
        const reader=new window.FileReader();
        reader.readAsArrayBuffer(file);

        reader.onloadend=async()=>{
            setData(prevValue=>{ return{
              description:prevValue.description,
              buffer:Buffer(reader.result)
            }
            });
            console.log(data.buffer);
        }
      }

      const handleDesc=(event)=>{
          var desc=event.target.value;
          setData(prevValue=>{
            return {description:desc,buffer:prevValue.buffer}
          });
      }

      const uploadImage=()=>{
        console.log("Submitting to ipfs...");
        client.add(data.buffer,async (error,result)=>{
          console.log("ipfs result",result);
          if(error){
            console.error(error)
            return
          }
          
          setLoading(true);

          await contract.methods.uploadImage(result[0].hash,data.description).send({from:accounts[0]});
         
          setLoading(false);
        });
      }

      const createImage=(image)=>{
        return (<Image
          id={image.id}
          url={image.hash}
          desc={image.description}
          tip={image.tipAmount}
          tipImageOwner={tipImageOwner}
        />);
      }

      const tipImageOwner=(id)=>{
        let tipAmount=Web3.utils.toWei('0.1','Ether');
        setLoading(true);

        contract.methods.tipImageOwner(id).send({from:accounts[0],value:tipAmount});
       
        setLoading(false);
      }

    return <div class="container">
    {loading?<p>Loading! Please wait..</p>:
        <div class="card">
        <div class="card-body">
        <p>Share Images</p>

<div class="input-group mb-3">
<input type="file" class="form-control" id="inputGroupFile01" aria-describedby="inputGroupFileAddon03" aria-label="Upload" onChange={captureFile}/>
</div>

<div class="input-group mb-3">
<input type="text" class="form-control" id="inputGroupFile02" placeholder="Image description.." name="description" value={data.description} onChange={handleDesc}/>
</div>

<div class="input-group">
  <button class="btn btn-primary form-control" type="button" id="inputGroupFileAddon03" onClick={uploadImage}>Upload!</button>
</div>
</div>

<div class="card-body">
      {images.map(createImage)}
</div>
        </div>}
    </div>

}

export default Content;