import React from "react";
import { useParams } from "react-router-dom";

const blogContent = {
  volunteer: {
    title: "Volunteer with Us",
    content: "Learn how to contribute your time and skills to support immigrants."
  },
  donate: {
    title: "Make a Donation",
    content: "Your financial support helps us provide crucial services."
  },
  collaborate: {
    title: "Partner with Us",
    content: "Join hands with us to create more inclusive communities."
  },
  // ... add others like immigration-guides, support-links, etc.
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogContent[slug];

  if (!post) {
    return <h2>Blog post not found</h2>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
};

export default BlogPost;
