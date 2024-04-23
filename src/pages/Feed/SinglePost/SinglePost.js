import React, { Component } from "react";

import Image from "../../../components/Image/Image";
import "./SinglePost.css";

class SinglePost extends Component {
  state = {
    title: "",
    author: "",
    date: "",
    image: "",
    content: "",
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;
    const graphqlQuery = {
      query: `
        query {
          getPost(postId: "${postId}") { 
            title content imageUrl createdAt creator {name} 
          }
        }
      `,
    };
    fetch("http://localhost:8080/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.token,
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.errors?.at(0).status) {
          throw new Error(resData.errors.at(0).message);
        }
        if (resData.errors) {
          console.log("Error!");
          throw new Error("Could not authenticate you!");
        }
        console.log(resData);
        resData = resData.data.getPost;
        this.setState({
          title: resData.title,
          author: resData.creator.name,
          image: "http://localhost:8080/" + resData.imageUrl,
          date: new Date(resData.createdAt).toLocaleDateString("en-US"),
          content: resData.content,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
