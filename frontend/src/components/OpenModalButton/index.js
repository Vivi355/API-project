import React from 'react';
import { useModal } from '../../context/Modal'; // custom hook

function OpenModalButton({
    modalComponent, // component to render inside the modal
    buttonText, // text of the button that opens the modal
    onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
    onModalClose, // optional: callback function that will be called once the modal is closed
}) {
    // consume context from modal context
    const { setModalContent, setOnModalClose } = useModal();

    // when button clicks
    const onClick = () => {
        // invoke onButtonClick if 'onButtonClick' is a function
        if (typeof onButtonClick === "function") onButtonClick();
        // invoke setOnModalClose only if 'onModalClose' is a function
        if (typeof onModalClose === "function") setOnModalClose(onModalClose);
        setModalContent(modalComponent); // open the modal with modalComponent
    };

    return <button onClick={onClick}>{buttonText}</button>;
}

export default OpenModalButton;
