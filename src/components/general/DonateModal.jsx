import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import DonateButton from './DonateButton';

function DonateModal() {
    const [exitIntent, setExitIntent] = useState(false);
    const [ready, setReady] = useState(false);

    const handleClose = () => setExitIntent(false);

    const documentMouseOut = (event) => {
        if (
            event.clientY < 50 &&
            event.relatedTarget == null &&
            event.target.nodeName.toLowerCase() !== 'select'
        ) {
            // let the modal know that user wants to leave :)
            setExitIntent(true);
            // stop watching for exit intent - popup will be shown just once
            document.removeEventListener('mouseout', documentMouseOut);
        }
    };

    // on first app load
    useEffect(() => {
        // watch for exit intent
        document.addEventListener('mouseout', documentMouseOut);
        // wait for 30 seconds before allowing to show the popup
        let timer = null;
        timer = setTimeout(() => {
            setReady(true);
        }, 30 * 1000);
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, []);

    return (
        <Modal
            backdrop="static"
            centered
            keyboard={false}
            onHide={handleClose}
            show={exitIntent && ready}
        >
            <Modal.Header closeButton>
                <Modal.Title>Voľby sú už za dverami!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Darujte už od 20 € na ich kontrolu aj Vy, aby boli férové.
                <br />
                Ďakujeme.
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <DonateButton xl />
            </Modal.Footer>
        </Modal>
    );
}

export default DonateModal;
