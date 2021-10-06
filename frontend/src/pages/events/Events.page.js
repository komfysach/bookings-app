import React, { Component } from 'react';

import Modal from '../../components/modal/Modal.component';
import Backdrop from '../../components/backdrop/Backdrop.component';
import AuthContext from '../../components/context/auth-context';
import './Events.styles.scss';

class EventsPage extends Component {

    state = {
        creating: false
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.titleElRef = React.createRef();
        this.dateElRef = React.createRef();
        this.imageElRef = React.createRef();
        this.descriptionElRef = React.createRef();
    }

    componentDidMount() {
        this.fetchEvents();
    }

    startCreateEventHandler = () => {
        this.setState({ creating: true });
    };

    modalConfirmHandler = () => {
        this.setState({ creating: false });
        const title = this.titleElRef.current.value;
        const date = this.dateElRef.current.value;
        const image = this.imageElRef.current.value;
        const description = this.descriptionElRef.current.value;

        if (
            title.trim().length === 0 ||
            date.trim().length === 0 ||
            image.trim().length === 0 ||
            description.trim().length === 0
        ) {
            return;
        }

        const event = { title, date, image, description };
        console.log(event);

        const requestBody = {
            query: `
                    mutation {
                        createEvent(eventInput: {title: "${title}", date: "${date}", description: "${description}", image: "${image}"}) {
                            _id
                            title
                            date
                            description
                            image
                            creator {
                                _id
                                email
                            }
                        }
                    }
                `
        };

        const token = this.context.token;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
            .then(resData => {
                console.log(resData);
            })
            .catch(err => {
                console.log(err);
            });
    };

    modalCancelHandler = () => {
        this.setState({ creating: false });
    };

    fetchEvents() {
        const requestBody = {
            query: `
                    query {
                        events {
                            _id
                            title
                            description
                            date
                            image
                            creator {
                                _id
                                email
                            }
                        }
                    }
                `
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
            .then(resData => {
                console.log(resData);
            })
            .catch(err => {
                console.log(err);
            });

    }

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
                        <form>
                            <div className="form-control">
                                <label htmlFor="title">Title</label>
                                <input type="text" id="title" ref={this.titleElRef}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="date">Date</label>
                                <input type="date" id="date" ref={this.dateElRef}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="description">Description</label>
                                <input type="description" rows="4" ref={this.descriptionElRef}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="image">Image</label>
                                <input type="file" id="image" ref={this.imageElRef}></input>
                            </div>
                        </form>
                    </Modal>}
                {this.context.token && (<div className="events_page__items">
                    <button onClick={this.startCreateEventHandler}>Create Event</button>
                </div>)}
                <ul className="events__list">
                    <li className="events__list-item">Test</li>
                    <li className="events__list-item">Test</li>
                </ul>
            </React.Fragment>
        )
    };
};

export default EventsPage;