'use strict'

const repository = (connection) => {

    const {db, ObjectID} = connection;

    const getCinemasByCity = (cityId) => {

        return new Promise((resolve, reject)=>{

            const cinemas = [];

            const cursor = db.collection('cinemas').find({city_id: cityId}, {_id: 1, name: 1});
            cursor.forEach((cinema) => {

                cinemas.push(cinema);
            }, (err) => {

                if(err){
                    reject(new Error(`Error while fetching cinemas for city id ${cityId}` ));
                }

                resolve(cinemas);
            });
        });
    }

    const getCinemaById = (id) => {

        return new Promise((resolve, reject)=>{

            db.collection('cinemas').findOne({

                _id: new ObjectID(id)
            }, {

                _id: 1,
                name: 1,
                cinemaPremieres: 1
            }, (err, cinema)=>{

                if(err){

                    reject(new Error(`Error while fetching cinema for id: ${id}`));
                }

                resolve(cinema);
            })
        });
    }

    const getCinemaScheduleByMovie = (options) => {

        return new Promise((resolve, reject)=>{

            db.collection.aggregate([
                {
                    $match: {
                        'city_id': options.cityId,
                        'cinemaRooms.schedules.movie_id': options.movieId
                    }
                },
                {
                    $project: {
                        'name': 1,
                        'cinemaRooms.name': 1,
                        'cinemaRooms.format': 1,
                        'cinemaRooms.schedules.time': 1,
                    }
                },
                {
                    $unwind: '$cinemaRooms'
                },
                {
                    $unwind: '$cinemaRooms.schedules'
                },
                {
                    $group: {
                        _id: {
                            name: '$name',
                            room: '$cinemaRooms.name',
                            format: '$cinemaRooms.format'
                        },
                        schedules: {
                            $addToSet: '$cinemaRooms.schedules.time'
                        }
                    }
                },
                {
                    $group: {
                        _id: '$_id.name',
                        schedules: {
                            $addToSet: {
                                room: '$_id.room',
                                format: '$_id.format',
                                schedules: '$schedules'
                            }
                        }
                    }
                }
            ], (err, result) => {

                if(err){

                    reject(new Error('Error while fetching schedules for movie err: ' + err));
                }

                resolve(result);
            });
        });
    }

    const disconnect = () => {

        db.close();
    }

    return {
        getCinemasByCity,
        getCinemaById,
        getCinemaScheduleByMovie,
        disconnect
    }
}

const connect = (connection) => {
    return new Promise((resolve, reject)=>{

        if(!connection){
            reject(new Error('connection db not supplied'))
        }
        resolve(repository(connection));
    });
}

module.exports.connect = connect;