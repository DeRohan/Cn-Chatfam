import React, { useEffect, useState } from "react";


function Image(props){
    const [imagesrc, setImagesrc] = useState("");

    useEffect(() => {
        const reader = new FileReader();
        reader.readAsDataURL(props.blob);
        reader.onloadend = () => {
            setImagesrc(reader.result);
        }
    }, [props.blob]);


    return (
        <img style={{width:150,height:"auto"}} src={imagesrc} alt="file" />
    );
};


export default Image