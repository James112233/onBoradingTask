﻿import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button } from 'semantic-ui-react';
import ProductCreate from './ProductCreate.jsx';
import ProductDelete from './ProductDelete.jsx';
import ProductUpdate from './ProductUpdate.jsx';

//const app = document.getElementById('product');
//ReactDOM.render(<div>Hello World!</div>, app);

class Table extends Component {
    //constructor(props) {
    //    super(props);
        state = {
            ProductList: [],
            Success: { Data: '' },

            showCreateModel: false,

            showDeleteModal: false,
            deleteId: 0,

            ProductId: '',
            ProductName: '',
            ProductPrice: '',

            showUpdateModel: false,
            updateId: 0,

            Success: [],
            errors: {}
        }


    componentDidMount() {
        this.loadData();
    }

    //Get products
    loadData = () => {
        $.ajax({
            url: "/Product/GetProductList",
            type: "GET",
            success: function (data) {
                this.setState({ ProductList: data })
            }.bind(this),
        });
    }

    //Clear Data
    clearData = () => {
        this.setState({
            ProductName: '',
            ProductPrice: '',
            errors: {}
        });
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

    //Show Create model
    showCreateModel = () => {
        this.setState({ showCreateModel: true });
    }

    //Close Create model
    closeCreateModel = () => {
        this.setState({ showCreateModel: false });
        this.loadData();
    }

    //Detect any value changes
    onChange = (e) => {

        this.setState({ [e.target.name]: e.target.value });
    }

    //Update
    showUpdateModel = (id) => {
        this.setState({ showUpdateModel: true });
        this.setState({ updateId: id });
        $.ajax({
            url: "/Product/GetUpdateProduct",
            type: "GET",
            data: { 'id': id },
            success: function (data) {
                var obj = JSON.parse(data);
                this.setState({ ProductId: obj.ID, ProductName: obj.NAME, ProductPrice: obj.PRICE });
            }.bind(this),
        });
    }

    //Close Update model
    closeUpdateModel = () => {
        this.setState({ showUpdateModel: false });
        this.clearData();
        this.loadData();
    }

    validateForm = () => {
        console.log(this.state.ProductName, this.state.ProductPrice);
        let errors = {}

        let formIsValid = true
        if (!this.state.ProductName) {
            formIsValid = false;
            errors['ProductName'] = '*Please enter the Product Name.';
        }

        if (!this.state.ProductPrice) {
            formIsValid = false;
            errors['ProductPrice'] = '*Please enter the Product Price'
        }

        if (typeof this.state.ProductPrice !== "undefined" && typeof this.state.ProductPrice !== "number") {
            if (!this.state.ProductPrice.match(/^\d+(\.\d{1,2})?$/)) {
                formIsValid = false;
                errors["ProductPrice"] = "*Please enter numbers only.";
            }
        }

        this.setState({
            errors: errors
        });
        return formIsValid
    }

    onUpdateSubmit = () => {
        if (this.validateForm()) {

            let data = { 'Id': this.state.ProductId, 'Name': this.state.ProductName, 'Price': this.state.ProductPrice };

            $.ajax({
                url: "/Product/UpdateProduct",
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
        //console.log(this.state.ProductId, this.state.ProductName, this.state.ProductPrice);
        let list = this.state.ProductList;
        let tableData = null;
        if (list != "") {
            tableData = list.map(product =>
                <tr key={product.Id}>
                    <td className="four wide">{product.Name}</td>
                    <td className="four wide">{product.Price}</td>

                    <td className="four wide">
                        <Button className="ui yellow button" onClick={this.showUpdateModel.bind(this, product.Id)}><i className="edit icon"></i>EDIT</Button>
                    </td>

                    <td className="four wide">
                        <Button className="ui red button" onClick={this.handleDelete.bind(this, product.Id)}><i className="trash icon"></i>DELETE</Button>
                    </td>

                </tr>

            )

        }
        return (
            <React.Fragment>
                <div>
                    <div><Button primary onClick={this.showCreateModel}>New Product</Button></div>
                    <ProductCreate onChange={this.onChange} onClose={this.closeCreateModel} onCreateSuccess={this.closeCreateModel} showCreateModel={this.state.showCreateModel} />

                </div>
                <div>
                    <ProductDelete delete={this.state.deleteId} onClose={this.closeDeleteModal} onDeleteSuccess={this.closeDeleteModal} showDeleteModal={this.state.showDeleteModal} />
                    <ProductUpdate onChange={this.onChange} update={this.state.updateId} onClose={this.closeUpdateModel} onUpdateSubmit={this.onUpdateSubmit} showUpdateModel={this.state.showUpdateModel} Id={this.state.ProductId} Name={this.state.ProductName} Price={this.state.ProductPrice} errors={this.state.errors} />
                    <table className="ui striped table">
                        <thead>
                            <tr>
                                <th className="four wide">Name</th>
                                <th className="four wide">Price ($)</th>
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

ReactDOM.render(<Table />, document.getElementById('product'))