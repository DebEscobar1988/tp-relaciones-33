const {body}=require('express-validator')

module.exports =  [
    
    body("title").notEmpty().withMessage("El campo no puede estar vacio"),
    body("rating").notEmpty().withMessage("El campo no puede estar vacio"),
    body("awards").notEmpty().withMessage("El campo no puede estar vacio"),
    body("release_date").notEmpty().withMessage("El campo no puede estar vacio"),
    body("genre_id").notEmpty().withMessage("El campo no puede estar vacio"),
    body("length").notEmpty().withMessage("El campo no puede estar vacio")
]

