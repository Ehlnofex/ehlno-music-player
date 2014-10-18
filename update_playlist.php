<?php

/* 
 * Copyright Thomas Vinckenbosch
 *     thomas@vckb.fr
 */

/*
 * playlist: {
 *  'name' : name,
 *  'songs' : [song_id, song_id, ...]
 * }
 */

$jsonObj = json_decode($_POST["jsonObj"], true);

$song_id = $jsonObj["id"];

$mongo_client = new MongoClient();
$db = $mongo_client->selectDB("ehlnoPlayerDb");
$pl_collection = $db->selectCollection("playlists");

foreach ($jsonObj["playlists"] as $pl) {
    if ($pl["selected"]) {
        $pl_collection->update(array("name" => $pl["name"]),
                               array('$addToSet' => array("songs" => new MongoId($song_id))));
    } else {
        $pl_collection->update(array("name" => $pl["name"]),
                               array('$pull' => array("songs" => new MongoId($song_id))));
    }
}