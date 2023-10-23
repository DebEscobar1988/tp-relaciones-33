const path = require("path");
const db = require("../database/models");
const sequelize = db.sequelize;
const moment = require("moment");
const { op } = require("sequelize");
const { validationResult } = require("express-validator");

//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;

const moviesController = {
  list: (req, res) => {
    db.Movie.findAll().then((movies) => {
      return res.render("moviesList.ejs", { movies });
    });
  },
  detail: (req, res) => {



    db.Movie.findByPk(req.params.id, {
      include: ["genre", "actors"],
    }).then((movie) => {
      /*  return res.send(movie) */
      return res.render("moviesDetail.ejs", { movie, moment });
    });
  },
  newMovie: (req, res) => {
    db.Movie.findAll({
      order: [["release_date", "DESC"]],
      limit: 5,
    }).then((movies) => {
      res.render("newestMovies", { movies });
    });
  },
  recomended: (req, res) => {
    db.Movie.findAll({
      where: {
        rating: { [db.Sequelize.Op.gte]: 8 },
      },
      order: [["rating", "DESC"]],
    }).then((movies) => {
      res.render("recommendedMovies.ejs", { movies });
    });
  },
  //Aqui dispongo las rutas para trabajar con el CRUD
  add: function (req, res) {
    const genres = db.Genre.findAll({
      order: ["name"],
    });
    const actors = db.Actor.findAll({
      order: [["first_name"], ["last_name"]],
    });
    Promise.all([genres, actors])
      .then(([genres, actors]) => {
        return res.render("moviesAdd", {
          genres,
          actors,
          moment,
        });
      })
      .catch((error) => console.log(error));
  },
  create: function (req, res) {
    let errors = validationResult(req);

    const { title, rating, awards, release_date, length, genre_id } = req.body;

    if (errors.isEmpty()) {
      db.Movie.create({
        title: title.trim(),
        rating,
        awards,
        release_date,
        length,
        genre_id,
      })

        .then((movie) => {
          return res.redirect("/movies");
        })
        .catch((error) => console.log(error));
    } else {
      const genres = db.Genre.findAll({
        order: ["name"],
      })
      const actors = db.Actor.findAll();
      Promise.all([genres, actors])
      .then(([genres, actors]) => {
        res.render("moviesAdd", {
          genres,
          actors,
          errors: errors.mapped(),
          old: req.body,
        });
      });
    }
  },
  edit: function (req, res) {
  
    const allGenres = db.Genre.findAll({    
      order: ["name"],
    });
    const movie = db.Movie.findByPk(req.params.id, {
      include: ["actors"] /* mando la película y los actores */,
    });
    const actors = db.Actor.findAll({
      order: [["first_name"], ["last_name"]],
    });
    Promise.all([allGenres, movie, actors])
      .then(([allGenres, movie, actors]) => {
     
        return res.render("moviesEdit", {
          Movie: movie,
          moment,
          allGenres,
          actors,
        });
      })
      .catch((error) => console.log(error));
  },
  update: function (req, res) {
   let { title, rating, awards, relase_date, length, genre_id, actors } = req.body;
    actors = typeof actors == "string" ? [actors] : actors /* si viene un string, transformalo en array */
    db.Movie.update(
      {
        title: title.trim(),
        rating,
        awards,
        relase_date,
        length,
        genre_id,
       
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )
      .then((response) => {
        console.log(response);
        db.Actor_Movie.destroy({
          where:{
            movie_id :req.params.id
          }
        })
        .then(()=>{
          /* si existe actors*/
        if(actors){
          /* recorre actores con el map, el cual es un array de números(string), donde cada elemento es el id de un actor */
            const actorsDb = actors.map(actor=>{
              /* retorna un objeto, con la clave movie_id + el actor_id que viene del checkbox*/
              return {
                movie_id: req.params.id,
                actor_id:actor
              }
            }) 
            db.Actor_Movie.bulkCreate(actorsDb,{
              validate :true
            })
            .then((response)=>{
                console.log(response);
            })                                     
}
        })

      })
      .catch((error) => console.log(error))
      .finally(()=> res.redirect("/movies/detail/" + req.params.id))
  },

  deleteMovie: function (req, res) {
    db.Movie.findByPk(req.params.id).then((movie) => {
      res.render("moviesDelete.ejs", { Movie: movie });
    });
  },
  destroy: function (req, res) {
    db.Actor_Movie.destroy({
      where: {
        movie_id : req.params.id,
      },
    })
      .then(() => {
        db.Actor.update(
          {
            favorite_movie_id: null,
          },
          {
            where: {
              favorite_movie_id: req.params.id,
            },
          }
        ).then(() => {
          db.Movie.destroy({
            where: {
              id: req.params.id,
            },
          }).then(() => {
            return res.redirect("/movies");
          });
        });
      })
      .catch((error) => {
        console.error(error);
      });
  },
};

module.exports = moviesController;
