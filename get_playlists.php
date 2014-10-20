<?php

/* 
 * Copyright Thomas Vinckenbosch
 *     thomas@vckb.fr
 */

$mongo_client = new MongoClient();
$db = $mongo_client->selectDB("ehlnoPlayerDb");
$music_collection = $db->selectCollection("musics");
$playlist_collection = $db->selectCollection("playlists");
$playlist = $playlist_collection->find();

echo json_encode(iterator_to_array($playlist));