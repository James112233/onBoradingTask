﻿import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button } from 'semantic-ui-react';
import StoreCreate from './StoreCreate.jsx';
import StoreDelete from './StoreDelete.jsx';
import StoreUpdate from './StoreUpdate.jsx';

//const app = document.getElementById('store');
//ReactDOM.render(<div>Hello World!</div>, app);

class Table extends Component {
    //constructor(props) {
    //    super(props);
        state = {
            StoreList: [],
            Success: { Data: '' },

            showCreateModel: false,

            showDeleteModal: false,
            deleteId: 0,

            StoreId: '',
            StoreName: '',
            StoreAddress: '',

            showUpdateModel: false,
            updateId: 0,

            Success: [],
            errors: {}
        }

    //    this.loadData = this.loadData.bind(this);

    //    this.showCreateModel = this.showCreateModel.bind(this);
    //    this.closeCreateModel = this.closeCreateModel.bind(this);
    //    this.onChange = this.onChange.bind(this);

    //    this.handleDelete = this.handleDelete.bind(this);
    //    this.closeDeleteModal = this.closeDeleteModal.bind(this);

    //    this.showUpdateModel = this.showUpdateModel.bind(this);
    //    this.closeUpdateModel = this.closeUpdateModel.bind(this);
    //    this.onUpdateSubmit = this.onUpdateSubmit.bind(this);
    //}

    componentDidMount() {
        this.loadData();
    }

    //Get stores
    loadData = () => {
        $.ajax({
            url: "/Store/GetStoreList",
            type: "GET",
            success: function (data) {
                this.setState({ StoreList: data })
            }.bind(this),
        });
    }

    //Show Create model
    showCreateModel = () => {
        this.setState({ showCreateModel: true });
    }

    //Close Create Model
    closeCreateModel = () => {
        this.setState({ showCreateModel: false });
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
    closeDeleteModal = () => {
        this.setState({ showDeleteModal: false });
        this.loadData();
    }

    //Update
    showUpdateModel = (id) => {
        this.setState({ showUpdateModel: true });
        this.setState({ updateId: id });

        $.ajax({
            url: "/Store/GetUpdateStore",
            type: "GET",
            data: { 'id': id },
            success: function (data) {
                var obj = JSON.parse(data);
                this.setState({ StoreId: obj.ID, StoreName: obj.NAME, StoreAddress: obj.ADDRESS });
            }.bind(this),
        });
    }
    //clear data
    clearData = () => {
        this.setState({
            StoreName: '',
            StoreAddress: '',
            errors: {}
        });
    }

    //Close update model
    closeUpdateModel = () => {
        this.setState({ showUpdateModel: false });
        this.clearData();
        this.loadData();
    }

    //Validation function
    validateForm = () => {

        let errors = {}

        let formIsValid = true
        if (!this.state.StoreName) {
            formIsValid = false;
            errors['StoreName'] = '*Please enter the Store Name.';
        }

        if (typeof this.state.StoreName !== "undefined") {
            if (!this.state.StoreName.match(/^[a-zA-Z ]*$/)) {
                formIsValid = false;
                errors["StoreName"] = "*Please enter alphabet characters only.";
            }
        }

        if (!this.state.StoreAddress) {
            formIsValid = false;
            errors['StoreAddress'] = '*Please enter the Store Address'
        }

        this.setState({
            errors: errors
        });
        return formIsValid
    }

    //Updata Submit
    onUpdateSubmit = () => {
        if (this.validateForm()) {

            let data = { 'Id': this.state.StoreId, 'Name': this.state.StoreName, 'Address': this.state.StoreAddress };

            $.ajax({
                url: "/Store/UpdateStore",
                type: "POST",
                data: data,
                success: function (data) {
                    this.setState({ Success: data })
                    this.closeUpdateModel();
                }.bind(this),
            });
        }
    }

    render() {
        //console.log(this.state.StoreId, this.state.StoreName, this.state.StoreAddress);
        let list = this.state.StoreList;
        let tableData = null;
        if (list != "") {
            tableData = list.map(store =>
                <tr key={store.StoreId}>
                    <td className="four wide">{store.StoreName}</td>
                    <td className="four wide">{store.StoreAddress}</td>

                    <td className="four wide">
                        <Button className="ui yellow button" onClick={this.showUpdateModel.bind(this, store.StoreId)}><i className="edit icon"></i>EDIT</Button>
                    </td>

                    <td className="four wide">
                        <Button className="ui red button" onClick={this.handleDelete.bind(this,store.StoreId)}><i className="trash icon"></i>DELETE</Button>
                    </td>

                </tr>

            )

        }
        return (
            <React.Fragment>
                <div>
                    <div><Button primary onClick={this.showCreateModel}>New Store</Button></div>
                    <StoreCreate onChange={this.onChange} onClose={this.closeCreateModel} onCreateSuccess={this.closeCreateModel} showCreateModel={this.state.showCreateModel} />
                </div>
                <div>
                    <StoreDelete delete={this.state.deleteId} onClose={this.closeDeleteModal} onDeleteSuccess={this.closeDeleteModal} showDeleteModal={this.state.showDeleteModal} />
                    <StoreUpdate onChange={this.onChange} update={this.state.updateId} onClose={this.closeUpdateModel} onUpdateSubmit={this.onUpdateSubmit} showUpdateModel={this.state.showUpdateModel} Id={this.state.StoreId} Name={this.state.StoreName} Address={this.state.StoreAddress} errors={this.state.errors} />
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

ReactDOM.render(<Table />, document.getElementById('store'))