﻿import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button } from 'semantic-ui-react';
import CustomerCreate from './CustomerCreate.jsx';
import CustomerDelete from './CustomerDelete.jsx';
import CustomerUpdate from './CustomerUpdate.jsx';

//const app = document.getElementById('customer');
//ReactDOM.render(<div>Hello World!</div>, app);

class Table extends Component {
    //constructor(props) {
    //    super(props);
        state = {
            CustomerList: [],
            Success: { Data: '' },

            showCreateModel: false,

            showDeleteModal: false,
            deleteId: 0,

            CustomerId: '',
            CustomerName: '',
            CustomerAddress: '',

            showUpdateModel: false,
            updateId: 0,

            Success: [],
            errors: {},

            commObj: []
        }

    componentDidMount() {
        this.loadData();
    }

    //Get customers
    loadData = () => {
        $.ajax({
            url: "/Customer/GetCustomerList",
            type: "GET",
            success: function (data) {
                this.setState({ CustomerList: data });
            }.bind(this),
        });
    }

    //Clear data
    clearData = () => {
        this.setState({
            CustomerName: '',
            CustomerAddress: '',
            errors: {}
        });
    }

    //Show Create model
    showCreateModel = () => {
        this.setState({ showCreateModel: true });
    }

    //Close Create model
    closeCreateModel = () => {
        this.setState({ showCreateModel: false });
        this.clearData();
        this.loadData();
        
    }

    //Detect any value changes
    onChange = (e) => {

        this.setState({ [e.target.name]: e.target.value });
    }

    //Delete    
    handleDelete = (id) => {

        this.setState({ showDeleteModal: true });
        this.setState({ deleteId: id });
    }

    //Close Delete model
    closeDeleteModal= () => {
        this.setState({ showDeleteModal: false });
        this.loadData();
        //window.location.reload()
    }

    //Show Update model
    showUpdateModel = (id) => {
        this.setState({ showUpdateModel: true, updateId: id});
        //this.setState({ updateId: id });
        console.log("Triggered id: ", id);
        var obj;

        $.ajax({
            url: "/Customer/GetUpdateCustomer",
            type: "GET",
            data: { 'id': id },
            success: function (data) {
                obj = JSON.parse(data);
                //this.setState({ commObj: JSON.parse(data) });
                this.setState({ CustomerId: obj.ID, CustomerName: obj.NAME, CustomerAddress: obj.ADDRESS });
            }.bind(this)
        });        
    }

    //Close Update model
    closeUpdateModel = () => {
        this.setState({ showUpdateModel: false });
        this.clearData();
        this.loadData();
    }

    validateForm = () => {
        console.log(this.state.CustomerName, this.state.CustomerAddress);

        let errors = {};

        let formIsValid = true;
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

    onUpdateSubmit = () => {
        if (this.validateForm()) {

            let data = { 'Id': this.state.CustomerId, 'Name': this.state.CustomerName, 'Address': this.state.CustomerAddress };
            console.log("UpdateId: ", this.state.CustomerId);
            $.ajax({
                url: "/Customer/UpdateCustomer",
                type: "POST",
                data: data,
                success: function (data) {
                    this.setState({ Success: data })
                    this.closeUpdateModel();
                }.bind(this)
            });
        }
    }

    render() {
        //console.log("state:", this.state.CustomerId, this.state.CustomerName, this.state.CustomerAddress);
        console.log("state:", this.state);
        let list = this.state.CustomerList;
        let tableData = null;
        if (list != "") {
            tableData = list.map(customer =>
                <tr key={customer.CustomerId}>
                    <td className="four wide">{customer.CustomerName}</td>
                    <td className="four wide">{customer.CustomerAddress}</td>

                    <td className="four wide">
                        <Button className="ui yellow button" onClick={this.showUpdateModel.bind(this, customer.CustomerId)}><i className="edit icon"></i>EDIT</Button>
                    </td>

                    <td className="four wide">
                        <Button className="ui red button" onClick={this.handleDelete.bind(this, customer.CustomerId)}><i className="trash icon"></i>DELETE</Button>
                    </td>

                </tr>

            )

        }
        return (
            <React.Fragment>
                <div>
                    <div><Button primary onClick={this.showCreateModel}>New Customer</Button></div>
                    <CustomerCreate onChange={this.onChange} onClose={this.closeCreateModel} onSubmitSuccess={this.closeCreateModel} showCreateModel={this.state.showCreateModel} />
                </div>
                <div>
                    <CustomerDelete delete={this.state.deleteId} onClose={this.closeDeleteModal} onDeleteSuccess={this.closeDeleteModal} showDeleteModal={this.state.showDeleteModal} />
                    <CustomerUpdate onChange={this.onChange} update={this.state.updateId} onClose={this.closeUpdateModel} onUpdateSubmit={this.onUpdateSubmit} showUpdateModel={this.state.showUpdateModel} Id={this.state.CustomerId} Name={this.state.CustomerName} Address={this.state.CustomerAddress} errors={this.state.errors} />
                    <table className="ui striped table">
                        <thead>
                            <tr>
                                <th className="four wide">Name</th>
                                <th className="four wide">Address</th>
                                <th className="four wide">Actions</th>
                                <th className="four wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData}
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        )
    }

}

ReactDOM.render(<Table />, document.getElementById('customer'))