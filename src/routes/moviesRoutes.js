const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/moviesController');
const createValidations = require("../validations/createValidation");
const updateValidations = require("../validations/updateValidation");
const {list,newMovie,recomended,detail,add,create,edit,update,deleteMovie,destroy}= require('../controllers/moviesController')

router.get('/movies',list);
router.get('/movies/new',newMovie);
router.get('/movies/recommended',recomended);
router.get('/movies/detail/:id',detail);
//Rutas exigidas para la creación del CRUD
router.get('/movies/add',add);
router.post('/movies/create',createValidations,create);
router.get('/movies/edit/:id', edit);
router.put('/movies/update/:id', update);
router.get('/movies/delete/:id',deleteMovie);
router.delete('/movies/delete/:id', destroy);

module.exports = router;