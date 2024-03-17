"use client"

import { useEffect, useState } from "react"
import { ProModal } from "./pro-modal";

export const ModalProvider = ()=> {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(()=> {
        setIsMounted(true);
    }, []);

    if(!isMounted){
        return null;
    }
    // modal-provider is the page and pro-modal is the component in it
    return(
        <>
        <ProModal />
        </>
    )
}