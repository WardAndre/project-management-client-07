// components/projects/ProjectDetails.js

import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import EditProject from "./EditProject";
import AddTask from "../tasks/AddTask";

class ProjectDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: null,
    };
    this.getSingleProject = this.getSingleProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
  }

  getSingleProject() {
    console.log(this.props);
    const { id } = this.props.match.params;

    axios
      .get("http://localhost:5000/api/projects/" + id, {
        withCredentials: true,
      })
      .then((response) => this.setState({ project: response.data }))
      .catch((error) => console.log(error));
  }

  componentDidMount() {
    this.getSingleProject();
  }

  deleteProject() {
    axios
      .delete("http://localhost:5000/api/projects/" + this.state.project._id, {
        withCredentials: true,
      })
      .then(() => this.props.history.push("/projects"))
      .catch((error) => console.log(error));
  }

  ownershipCheck(project) {
    if (
      this.props.loggedInUser &&
      project.owner === this.props.loggedInUser._id
    ) {
      return (
        <div>
          <div>
            <EditProject
              theProject={this.state.project}
              getTheProject={this.getSingleProject}
              {...this.props}
            />
          </div>
          <button className="button" onClick={this.deleteProject}>
            Delete project
          </button>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        {this.state.project ? (
          <>
            <h1 className="title is-1">{this.state.project.title}</h1>
            <p>{this.state.project.description}</p>
            <h2>Tasks</h2>
            <ul>
              {this.state.project.tasks.map((task, idx) => (
                <li key={idx}>
                  <Link
                    to={`/projects/${this.state.project._id}/tasks/${task._id}`}
                  >
                    {task.title}
                  </Link>
                </li>
              ))}
            </ul>
            {this.ownershipCheck(this.state.project)}
            <br />
            <AddTask
              theProject={this.state.project}
              getTheProject={this.getSingleProject}
            />
            <br />
            <Link to={"/projects"}>Back to projects</Link>
          </>
        ) : (
          <h4>loading...</h4>
        )}
      </div>
    );
  }
}

export default ProjectDetails;
