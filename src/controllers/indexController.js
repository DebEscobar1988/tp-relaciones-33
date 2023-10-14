const db = require("../database/models");

module.exports = {
  index: (req, res) => {
    res.render("index", {
      title: "Movies Digital House",
    });
  },
  admin: (req, res) => {
    db.Movie.findAll()
      .then((movie) => {
        res.render("admin", {
          title: "Administrador",
          movie,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
