<?php

/*
 * Copyright Thomas Vinckenbosch
 *     thomas@vckb.fr
 */


header("Content-Type: application/json");

// Connect to database and get all files
$mongo_client = new MongoClient();
$db = $mongo_client->selectDB("ehlnoPlayerDb");
$music_collection = $db->selectCollection("musics");

if (isset($_GET["id"])) {
    $music_id = $_GET["id"];
    $music = $music_collection->findOne(array('_id' => new MongoId($music_id)));
    
    $playlist_collection = $db->selectCollection("playlists");
    $playlist = $playlist_collection->find();
    
    $result = array("music" => $music,
                    "playlist" => iterator_to_array($playlist));
    echo json_encode($result);
} else {
    $artist = (isset($_GET["artist"])) ? $_GET["artist"] : NULL;
    $album = (isset($_GET["album"])) ? $_GET["album"] : NULL;
    $playlist = (isset($_GET["playlist"])) ? $_GET["playlist"] : NULL;

    $query_array = array();
    if ($artist) {
        $query_array["artist"] = $artist;
    }
    if ($album) {
        $query_array["album"] = $album;
    }
    if ($playlist) {
        //$query_array["playlist"] = ''; // Not yet implemented
    }
    
    $cursor = $music_collection->find($query_array);
    echo json_encode(iterator_to_array($cursor));
}
