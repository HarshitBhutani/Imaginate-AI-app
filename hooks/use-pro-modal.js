import {create} from "zustand";


export const useProModal = create((set)=> ({
    isOpen: false,
    onOpen: ()=> set({isOpen: true}),
    onClose: ()=> ({isOpen: false}),
}))


