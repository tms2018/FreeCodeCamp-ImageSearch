// import the mongoose model.
var searchTerm = require('../database/models/SearchTerm');
// import the module for image searches and provide credentials
var GoogleImages = require('google-images');
var googleImages = new GoogleImages( process.env.CX, process.env.API_KEY );

/* Saves the search term to the DB and creates
** a google images search.
*/
module.exports.Search = function(req, res, next) {

  saveSearchToDB(req.params.term);
  var offset = validateOffsetQuery(req);

  googleImages.search( req.params.term, { page: offset} )
    .then( function(images) {

      res.status(200).send(images);
  }).catch( function(err) {
      console.log(err);
  });

}

/* returns a json object showing the latest
** search terms sent to the api.  The db is capped
** at 10 entries.
*/
module.exports.Latest = function(req, res, next) {
  searchTerm.find().select({"_id": 0, "__v": 0}).exec( function(err, terms) {
    if (err) return res.status(500).json({ "error" : "Internal Database Error" });

    res.status(200).json(terms);
  });
}

/* ensure the offset query is specified
** and is an integer value greater than 0
** otherwise retuern 1, the default page
** for google-images
*/
function validateOffsetQuery(req) {
  if ( req.query.hasOwnProperty("offset")
    && !Number.isNaN(Number.parseInt(req.query.offset))
    && req.query.offset > 0) {

     return req.query.offset;
  }
  return 1;
}

// *** save the current search term to mongoDB *** //
function saveSearchToDB(term) {
  var newTerm = new searchTerm({
    "term":term,
    "when": Date.now()
  });
  newTerm.save( function(err, term) {
    if (err) {
      console.log( err );
    }
  });
}
