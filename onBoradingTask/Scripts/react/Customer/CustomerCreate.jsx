import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button, Form } from 'semantic-ui-react';

export default class CustomerCreate extends Component {
    //constructor(props) {
    //    super(props);
        state = {
            Success: { Data: '' },
            CustomerName: '',
            CustomerAddress: '',

            Success: [],
            errors: {}
        }


    validateForm = () => {

        let errors = {}

        let formIsValid = true
        if (!this.state.CustomerName) {
            formIsValid = false;
            errors['CustomerName'] = '*Please enter the Customer Name.';
        }

        if (typeof this.state.CustomerName !== "undefined") {
            if (!this.state.CustomerName.match(/^[a-zA-Z ]*$/)) {
                formIsValid = false;
                errors["CustomerName"] = "*Please enter alphabet characters only.";
            }
        }

        if (!this.state.CustomerAddress) {
            formIsValid = false;
            errors['CustomerAddress'] = '*Please enter the Customer Address'
        }

        this.setState({
            errors: errors
        });
        return formIsValid
    }

    onCreateSubmit = (e) => {
        e.preventDefault();
        if (this.validateForm()) {
            let data = { 'Name': this.state.CustomerName, 'Address': this.state.CustomerAddress };

            $.ajax({
                url: "/Customer/CreateCustomer",
                type: "POST",
                data: data,
                success: function (data) {
                    this.setState({ Success: data })
                    this.onClose();
                }.bind(this)
            });

        }
    }



    onClose = () => {
        this.setState({
            CustomerName: '',
            CustomerAddress: '',
            errors: {}
        }, () => { console.log("Create State: ", this.state); });
        this.props.onClose();
        
        //window.location.reload()
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        console.log("Create Model State: ", this.state);
        return (
            <React.Fragment>
                <Modal open={this.props.showCreateModel} onClose={this.onClose} size={'small'}>
                    <Modal.Header> Create Customer </Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <label>Customer Name</label>
                                <input type="text" name="CustomerName" placeholder='Name' onChange={this.onChange} />
                                <div style={{ color: 'red' }}>
                                    {this.state.errors.CustomerName}
                                </div>
                            </Form.Field>
                            <Form.Field>
                                <label>Address</label>
                                <input type="text" name="CustomerAddress" placeholder='Address' onChange={this.onChange} />
                                <div style={{ color: 'red' }}>
                                    {this.state.errors.CustomerAddress}
                                </div>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.onClose} secondary >Cancel
                        </Button>
                        <Button onClick={this.onCreateSubmit} className="ui green button">Create
                        <i className="check icon"></i>
                        </Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        )
    }
}