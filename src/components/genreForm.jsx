import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getGenre, saveGenre } from "../services/genreService";
import { toast } from "react-toastify";

class GenreForm extends Form {
  state = {
    data: {
      name: "",
    },
    errors: {},
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string().required().min(5).max(50).label("Name"),
  };

  async populateGenre() {
    try {
      const genreId = this.props.match.params.id;
      if (genreId === "new") return;

      const { data: genre } = await getGenre(genreId);
      this.setState({ data: this.mapToViewModel(genre) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateGenre();
  }

  mapToViewModel(genre) {
    return {
      _id: genre._id,
      name: genre.name,
    };
  }

  doSubmit = async () => {
    try {
      await saveGenre(this.state.data);
      toast.success("Genre saved successfully");
      this.props.history.push("/genres");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        const errorMessage = ex.response.data;
        if (typeof errorMessage === "string") {
          errors.name = errorMessage;
        }
        this.setState({ errors });
        toast.error(errorMessage);
      } else {
        toast.error("Error saving genre");
      }
    }
  };

  render() {
    const genreId = this.props.match.params.id;
    const isNew = genreId === "new";

    return (
      <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
        <div className="card" style={{ padding: "40px" }}>
          <h1 style={{ color: "var(--text-primary)", marginBottom: "30px" }}>
            {isNew ? "New Genre" : "Edit Genre"}
          </h1>
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("name", "Name")}
            <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
              {this.renderButton("Save")}
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => this.props.history.push("/genres")}
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

export default GenreForm;

