<?php

/*
 * Copyright Thomas Vinckenbosch
 *     thomas@vckb.fr
 */

// Connect
$mongo_client = new MongoClient();
$db = $mongo_client->selectDB("ehlnoPlayerDb");
$collection = $db->selectCollection("playlists");
// Create new document
$document = array("name" => $_GET["name"]);
$collection->insert($document);

exit();
