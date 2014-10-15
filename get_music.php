<?php
/*
 * Copyright Thomas Vinckenbosch
 *     thomas@vckb.fr
 */


header("Content-Type: text/plain"); // Utilisation d'un header pour spécifier le type de contenu de la page. Ici, il s'agit juste de texte brut (text/plain). 

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

// Connect to database and get all files
$mongo_client = new MongoClient();
$db = $mongo_client->selectDB("ehlnoPlayerDb");
$collection = $db->selectCollection("musics");
$cursor = $collection->find($query_array);
echo json_encode(iterator_to_array($cursor));
