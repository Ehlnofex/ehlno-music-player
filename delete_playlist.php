<?php

/* 
 * Copyright Thomas Vinckenbosch
 *     thomas@vckb.fr
 */

// Connect
$mongo_client = new MongoClient();
$db = $mongo_client->selectDB("ehlnoPlayerDb");

$pl_name = $_GET["name"];

$music_collection = $db->selectCollection("playlists");
// Delete from playlist collection
$music_collection->remove(array("name" => $pl_name));

exit();
