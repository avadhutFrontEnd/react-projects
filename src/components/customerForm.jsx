import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getCustomer, saveCustomer } from "../services/customerService";
import { toast } from "react-toastify";

class CustomerForm extends Form {
  state = {
    data: {
      name: "",
      phone: "",
      isGold: false,
    },
    errors: {},
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string().required().min(5).max(50).label("Name"),
    phone: Joi.string().required().min(5).max(50).label("Phone"),
    isGold: Joi.boolean().label("Gold Member"),
  };

  async populateCustomer() {
    try {
      const customerId = this.props.match.params.id;
      if (customerId === "new") return;

      const { data: customer } = await getCustomer(customerId);
      this.setState({ data: this.mapToViewModel(customer) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateCustomer();
  }

  mapToViewModel(customer) {
    return {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      isGold: customer.isGold || false,
    };
  }

  doSubmit = async () => {
    try {
      await saveCustomer(this.state.data);
      toast.success("Customer saved successfully");
      this.props.history.push("/customers");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        const errorMessage = ex.response.data;
        // If it's a validation error, try to parse it
        if (typeof errorMessage === "string") {
          errors.name = errorMessage;
        }
        this.setState({ errors });
      }
    }
  };

  render() {
    const customerId = this.props.match.params.id;
    const isNew = customerId === "new";

    return (
      <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
        <div className="card" style={{ padding: "40px" }}>
          <h1 style={{ color: "var(--text-primary)", marginBottom: "30px" }}>
            {isNew ? "New Customer" : "Edit Customer"}
          </h1>
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("name", "Name")}
            {this.renderInput("phone", "Phone")}
            {this.renderCheckbox("isGold", "Gold Member")}
            <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
              {this.renderButton("Save")}
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => this.props.history.push("/customers")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default CustomerForm;

