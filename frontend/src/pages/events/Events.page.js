import React, { Component } from 'react';

import Modal from '../../components/modal/Modal.component';
import Backdrop from '../../components/backdrop/Backdrop.component';
import './Events.styles.scss';

class EventsPage extends Component {

    state = {
        creating: false
    };

    startCreateEventHandler = () => {
        this.setState({ creating: true });
    };

    modalConfirmHandler = () => {
        this.setState({ creating: false });
    };

    modalCancelHandler = () => {
        this.setState({ creating: false });
    };

    render() {
        return (
            <React.Fragment>
                {this.state.creating && <Backdrop />}
                {this.state.creating &&
                    <Modal
                        title="Add Event"
                        canCancel
                        canConfirm
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.modalConfirmHandler}>
                        <p>Modal content</p>
                    </Modal>}
                <div className="events_page__items">
                    <button onClick={this.startCreateEventHandler}>Create Event</button>
                </div>
            </React.Fragment>
        )
    }
}

export default EventsPage;