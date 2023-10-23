module.exports = (sequelize, dataTypes) => {
    let alias = 'Actor_Movie'; // el alias debe estar en singular
    let cols = {
        id: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            primaryKey: true,
         
            autoIncrement: true
        },

        movie_id:{
            type:dataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        actor_id:{
            type : dataTypes.INTEGER.UNSIGNED,
            allowNull:false
        }
        
      
    };
    let config = {
        tableName: "actor_movie",/* le decimos a sequelize que la tabla se llama actor_movie */
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false
    }
    const Actor_Movie = sequelize.define(alias,cols,config);

    return Actor_Movie
};