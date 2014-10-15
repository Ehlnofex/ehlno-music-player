<?php

/* 
 * Copyright Thomas Vinckenbosch
 *     thomas@vckb.fr
 */

$allowed_exts = array('mp3');

$some_string = '';
if (isset($_FILES['uploaded_file']) && $_FILES['uploaded_file']['error'] == 0) {
    $file_infos = pathinfo($_FILES['uploaded_file']['name']);
    $file_extension = $file_infos['extension'];
    if (in_array($file_extension, $allowed_exts)) { // The file is ok
        // Save the file in ./files/
        $new_file_name = basename($_FILES['uploaded_file']['name']); // FIXME perform manipulations ?
        $upload_path = './files/' . $new_file_name;
        move_uploaded_file($_FILES['uploaded_file']['tmp_name'], $upload_path);
        // Connect to Mongo db
        $mongo_client = new MongoClient();
        $db = $mongo_client->selectDB('ehlnoPlayerDb');
        $collection = $db->selectCollection('musics');
        // Create new document
        $document = array('title' => $_POST['title'],
            'album' => $_POST['album'],
            'artist' => $_POST['artist'],
            'path' => $upload_path);
        $collection->insert($document);
    } else { // Error somewhere
        $some_string = 'bad';
    }
} else { // Error while uploading
    $some_string = 'Error with download: error code: ' . $_FILES['uploaded_file']['error'];
}

if ($some_string != '') {
    echo "Fail: " . $some_string;
} else {
    // Go back to index page
    //header('Location: upload.php');
    echo 'Done :)';
}
