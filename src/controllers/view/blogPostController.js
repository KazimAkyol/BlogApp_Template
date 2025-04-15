"use strict";
/* -------------------------------------------------------
    EXPRESSJS - BLOG Project with Mongoose
------------------------------------------------------- */

const BlogPost = require("../../models/blogPostModel");
const BlogCategory = require("../../models/blogCategoryModel");
const removeQueryParam = require("../../helpers/removeQueryParam");

// ------------------------------------------
// BlogPost
// ------------------------------------------

module.exports = {
  list: async (req, res) => {
    const data = await res.getModelList(BlogPost, {}, "blogCategoryId");

    const categories = await BlogCategory.find();

    const recentPosts = await BlogPost.find()
      .sort({ createdAt: "desc" })
      .limit(3);

    const details = await res.getModelListDetails(BlogPost, {
      published: true,
    });

    let pageUrl = "";
    const queryUrl = req.originalUrl.split("?")[1];

    if (queryUrl) {
      pageUrl = removeQueryParam(queryUrl, "page");
    }

    pageUrl = pageUrl ? "&" + pageUrl : "";

    res.render("index", {
      categories,
      posts: data,
      recentPosts,
      details,
      pageUrl,
    }); //* Sirasiyla tanimlanan bu degiskenler render edilir.
  },

  create: async (req, res) => {
    const data = await BlogPost.create(req.body);

    res.status(201).send({
      error: false,
      body: req.body,
      result: data,
    });
  },

  read: async (req, res) => {
    // req.params.postId
    // const data = await BlogPost.findById(req.params.postId)
    const data = await BlogPost.findOne({ _id: req.params.postId }).populate(
      "blogCategoryId"
    ); // get Primary Data

    res.render("postRead", { post: data });
  },

  update: async (req, res) => {
    // const data = await BlogPost.findByIdAndUpdate(req.params.postId, req.body, { new: true }) // return new-data

    if (req.method == "POST") {
      const data = await BlogPost.updateOne(
        { _id: req.params.postId },
        req.body,
        { runValidators: true }
      );
      res.redirect("/blog/post");
    }

    //* Get istegi atıldıgında bilgilerin formun icine gelebilmesi icin:
    else {
      const data = await BlogPost.findOne({ _id: req.params.postId }).populate(
        "blogCategoryId"
      ); //* get Primary Data
      //* Select'deki categories gösterebilmek için bu bilgiyi de cekip postForm'a gönderiyoruz:
      const categories = await BlogCategory.find();
      res.render("postForm", { post: data, categories });
    }
  },

  delete: async (req, res) => {
    const data = await BlogPost.deleteOne({ _id: req.params.postId });

    res.sendStatus(data.deletedCount >= 1 ? 204 : 404);
  },
};
