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
    $playlist = (isset($_GET["playlist"])) ? $_GET["playlist"] : NULL;

    if ($playlist) {
        //$query_array["playlist"] = ''; // Not yet implemented
        $pl_collection = $db->selectCollection("playlists");
        $pl = $pl_collection->find(array("name" => $playlist));
        
        $songs_id = array();
        foreach ($pl as $pl_cursor) {
            foreach ($pl_cursor["songs"] as $pl_elt) {
                array_push($songs_id, new MongoId($pl_elt));
            }
        }
        
        $cursor = $music_collection->find(array("_id" => array('$in' => $songs_id)));
        echo json_encode(iterator_to_array($cursor));

    } else {
        $cursor = $music_collection->find();
        echo json_encode(iterator_to_array($cursor));
    }
}
