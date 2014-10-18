<?php

/* 
 * Copyright Thomas Vinckenbosch
 *     thomas@vckb.fr
 */

// Connect
$mongo_client = new MongoClient();
$db = $mongo_client->selectDB("ehlnoPlayerDb");

$music_id = $_GET["id"];

$music_collection = $db->selectCollection("musics");
// Delete file from server
$music = $music_collection->findOne(array('_id' => new MongoId($music_id)));
unlink($music['path']);
// Delete from music collection
$music_collection->remove(array("_id" => new MongoId($music_id)));

// Delete each occurences from the playlist collection
$pl_collection = $db->selectCollection("playlists");
$update_object = array('$pull' => array('songs' => new MongoId($music_id)));
$pl_collection->update(array(), $update_object, array("multiple" => true));

exit();
