import React from "react";

function Image(props){
    return <div className="list-group-item">
        <img class="w-100 p-3" src={`https://ranjutech.infura-ipfs.io/ipfs/${props.url}`}/>
        <p>{props.desc}</p>
        <p>{props.tip}<span> Tip Amount</span></p>
        <button onClick={()=>props.tipImageOwner(props.id)}>Tip</button>
    </div>
}

export default Image;