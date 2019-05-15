import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button } from 'semantic-ui-react';
import SaleCreate from './SalesCreate.jsx';
import SaleDelete from './SalesDelete.jsx';
import SaleUpdate from './SalesUpdate.jsx';
import { fail } from 'assert';

//const app = document.getElementById('sales');
//ReactDOM.render(<div>Hello World!</div>, app);

class Table extends Component {
    //constructor(props) {
    //    super(props);
        state = {
            SalesList: [],
            Success: { Data: '' },

            showCreateModel: false,

            showDeleteModal: false,
            deleteId: 0,

            Id: '',
            ProductId: '',
            StoreId: '',
            CustomerId: '',
            DateSold: '',

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

    //    this.DateConverter = this.DateConverter.bind(this);
    //}

    componentDidMount() {
        this.loadData();
    }

    DateConverter = (tempdate) => {
        var temp = new Date(tempdate);
        var date = (temp.getFullYear() + "/" + ((temp.getMonth()) + 1) + "/" + temp.getDate());
        return date;
    }

    TableDateForm = (tempdate) => {
        var converted = parseInt((tempdate.replace("/Date(", "").replace(")/", "")));

        var temp = new Date(converted);
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const d = new Date(converted);
        var date = (temp.getDate() + " " + monthNames[d.getMonth()] + ", " + temp.getFullYear());
        return date;
    }

    //Check date format
    isValidDate = (tempdate) => {
        var regex_date = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
        if (!regex_date.test(tempdate)) {
            return false;
        }

        var parts = tempdate.split("/");
        var day = parseInt(parts[2], 10);
        var month = parseInt(parts[1], 10);
        var year = parseInt(parts[0], 10);

        if (year < 1000 || year > 3000 || month == 0 || month > 12) {
            return false;
        }

        var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        if (year % 4 == 0 || year % 100 != 0 && year % 4 == 0) {
            monthLength[1] = 29;
        }

        return day > 0 && day <= monthLength[month - 1];
    }

    //Get sales
    loadData = () => {
        $.ajax({
            url: "/Sales/GetSalesList",
            type: "GET",
            success: function (data) {
                this.setState({ SalesList: data })
            }.bind(this),
        });
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

    //Clear data
    clearData = () => {
        this.setState({
            ProductId: '',
            StoreId: '',
            CustomerId: '',
            DateSold: '',
            errors: {}
        });
    }

    //Update
    showUpdateModel = (id) => {
        this.setState({ showUpdateModel: true });
        this.setState({ updateId: id });

        $.ajax({
            url: "/Sales/GetUpdateSale",
            type: "GET",
            data: { 'id': id },
            success: function (data) {
                var obj = JSON.parse(data);
                //console.log("data: ", data);
                this.setState({
                    SaleId: obj.ID,
                    CustomerId: obj.CUSTOMERID,
                    ProductId: obj.PRODUCTID,
                    StoreId: obj.STOREID,
                    DateSold: this.DateConverter(obj.DATESOLD)
                });
            }.bind(this),
        });
    }

    closeUpdateModel = () => {
        this.setState({ showUpdateModel: false });
        this.clearData();
        this.loadData();
    }

    validateForm = () => {

        let errors = {}

        let formIsValid = true
        if (!this.state.CustomerId) {
            formIsValid = false;
            errors['CustomerId'] = '*Please select the Customer.';
        }

        if (!this.state.ProductId) {
            formIsValid = false;
            errors['ProductId'] = '*Please select the Product.'
        }

        if (!this.state.StoreId) {
            formIsValid = false;
            errors['StoreId'] = '*Please select the Store.'
        }


        if (!this.isValidDate(this.state.DateSold)) {
            formIsValid = false;
            errors['DateSold'] = '*Please provide correct date format yyyy/mm/dd.'
        }

        if (!this.state.DateSold) {
            formIsValid = false;
            errors['DateSold'] = '*Please provide the sale date.'
        }
        
        this.setState({
            errors: errors
        });
        return formIsValid
    }

    onUpdateSubmit = () => {
        if (this.validateForm()) {
            let data = {
                'Id': this.state.updateId,
                'ProductId': this.state.ProductId,
                'CustomerId': this.state.CustomerId,
                'StoreId': this.state.StoreId,
                'DateSold': this.state.DateSold
            };

            $.ajax({
                url: "/Sales/UpdateSale",
                type: "POST",
                data: data,
                success: function (data) {
                    this.setState({ Success: data });
                    this.closeUpdateModel();
                    //console.log("onUpdateSubmit", data);
                }.bind(this),
            });
        }
    }

    render() {
        console.log("State: ", this.state)
        let list = this.state.SalesList;
        let tableData = null;
        if (list != "") {
            tableData = list.map(sale =>
                <tr key={sale.Id}>
                    <td className="two wide">{sale.CustomerName}</td>
                    <td className="two wide">{sale.ProductName}</td>
                    <td className="two wide">{sale.StoreName}</td>
                    <td className="two wide">{this.TableDateForm(sale.DateSold)}</td>

                    <td className="four wide">
                        <Button className="ui yellow button" onClick={this.showUpdateModel.bind(this,sale.Id)}><i className="edit icon"></i>EDIT</Button>
                    </td>

                    <td className="four wide">
                        <Button className="ui red button" onClick={this.handleDelete.bind(this,sale.Id)}><i className="trash icon"></i>DELETE</Button>
                    </td>

                </tr>

            )

        }
        return (
            <React.Fragment>
                <div>
                    <div><Button primary onClick={this.showCreateModel}>New Sale</Button></div>
                    <SaleCreate onChange={this.onChange} onClose={this.closeCreateModel} onCreateSuccess={this.closeCreateModel} showCreateModel={this.state.showCreateModel} checkDate={this.isValidDate} />
                </div>

                <div>
                    <SaleDelete delete={this.state.deleteId} onClose={this.closeDeleteModal} onDeleteSuccess={this.closeDeleteModal} showDeleteModal={this.state.showDeleteModal} />
                    <SaleUpdate onChange={this.onChange} update={this.state.updateId} onClose={this.closeUpdateModel} onUpdateSubmit={this.onUpdateSubmit} showUpdateModel={this.state.showUpdateModel}
                        Id={this.state.Id} ProductId={this.state.ProductId} CustomerId={this.state.CustomerId} StoreId={this.state.StoreId} DateSold={this.state.DateSold} errors={this.state.errors} />
                    <table className="ui striped table">
                        <thead>
                            <tr>
                                <th className="four wide">Customer</th>
                                <th className="four wide">Product</th>
                                <th className="four wide">Store</th>
                                <th className="four wide">DateSold</th>
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

ReactDOM.render(<Table />, document.getElementById('sales'))