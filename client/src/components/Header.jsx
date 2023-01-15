import React, {useEffect, useState} from "react";
import useEth from "../contexts/EthContext/useEth";


function Header(){

  const { state: { contract, accounts } } = useEth();
  const [add,setAdd]=useState('Address');

useEffect(() => {
    if(accounts!=null){
        setAdd(accounts[0]);
    }
  });
  
    return <nav class="navbar bg-primary">
    <div class="container-fluid">
      <p class="navbar-brand">Detragram</p>
      <p>{add}</p>
    </div>
    </nav>;
}

export default Header;