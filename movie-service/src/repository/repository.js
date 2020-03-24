"use strict"

const repository = (db) => {

    const collection = db.collection('movies');

    const getAllMovies = () => {

        return new Promise((resolve, reject)=>{

            const movies = [];
            const addMovie = (movie) => {
                movies.unshift(movie);
            };
            const sendMovies = (err) => {
                if(err){
                    return reject(new Error("Error while fetching all movies " + err));
                }

                resolve(movies);
            };
            const projection = {title: 1, id: 1};
            const cursor = collection.find({}, projection);
            cursor.forEach(addMovie, sendMovies);
        });
    }

    const getMoviePremiers = () => {

        return new Promise((resolve, reject)=>{

            const movies = [];
            const currentDay = new Date();
            const query = {
                releaseYear: {
                    $gt: currentDay.getFullYear() - 1,
                    $lte: currentDay.getFullYear()
                },
                releaseMonth: {
                    $gte: currentDay.getMonth() + 1,
                    $lte: currentDay.getMonth() + 2
                },
                releaseDay: {
                    $lte: currentDay.getDate()
                }
            };
            const cursor = collection.find(query);
            const addMovie = (movie) => {
                movies.push(movie);
            };
            const sendMovies = (err) => {
                if(err){
                    return reject(new Error("An error occured while fetching premiers: " + err));
                }

                resolve(movies);
            }
            cursor.forEach(addMovie, sendMovies);
        });
    }

    const getMovieById = (id) => {

        return new Promise((resolve, reject)=>{

            const projection = {_id:0, id:1, title:1, format:1};
            const sendMovie = (err, movie) => {
                if(err){
                    return reject(new Error(`Error while fetching movie for id ${id}`));
                }

                resolve(movie);
            };

            collection.findOne({id: id}, projection, sendMovie);
        });
    }

    const disconnect = () => {

        db.close();
    }

    return {
        getAllMovies,
        getMoviePremiers,
        getMovieById,
        disconnect
    };
}

const connect = (connection) => {

    return new Promise((resolve, reject)=>{

        if(!connection){
            reject(new Error('DB connection not supplied'));
        }

        resolve(repository(connection));
    });
}

module.exports.connect = connect;

