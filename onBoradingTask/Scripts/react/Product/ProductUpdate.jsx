﻿import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button, Form } from 'semantic-ui-react';

export default class ProductUpdate extends Component {
    //constructor(props) {
    //    super(props);
        state = {

        }

    //    this.onClose = this.onClose.bind(this);
    //}

    onClose = () => {
        this.setState({ showUpdateModel: false });
    }

    render() {
        return (
            <React.Fragment>
                <Modal open={this.props.showUpdateModel} onClose={this.props.onClose} size='small'>
                    <Modal.Header> Edit Product </Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <label>Name</label>
                                <input type="text" name="ProductName" placeholder='Name' value={this.props.Name} onChange={this.props.onChange} />
                                <div style={{ color: 'red' }}>
                                    {this.props.errors.ProductName}
                                </div>
                            </Form.Field>
                            <Form.Field>
                                <label>Price</label>
                                <input type="text" name="ProductPrice" placeholder='Price' value={this.props.Price} onChange={this.props.onChange} />
                                <div style={{ color: 'red' }}>
                                    {this.props.errors.ProductPrice}
                                </div>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.props.onClose} secondary >Cancel
                        </Button>
                        <Button onClick={this.props.onUpdateSubmit} className="ui green button">Edit
                        <i className="check icon"></i>
                        </Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        )
    }
}