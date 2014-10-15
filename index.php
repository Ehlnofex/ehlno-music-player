<?php
/* 
 * Copyright Thomas Vinckenbosch
 *     thomas@vckb.fr
 */
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Ehlnofex Music Player</title>
        <link rel="stylesheet" href="includes/css/bootstrap-theme.min.css" />
        <link rel="stylesheet" href="includes/css/bootstrap.min.css" />
        <link rel="stylesheet" href="includes/css/font-awesome.min.css" />
        <link rel="stylesheet" href="includes/css/dataTables.bootstrap.css"/>
        <link rel="stylesheet" href="css/style.css" />
    </head>

    <body>
        <div class="container-fluid">           
            <!-- Navigation bar -->
            <div class="navbar navbar-fixed-top navbar-inverse" role="navigation">
                <div class="container">
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <a id="main_link" class="navbar-brand" href="#">Ehlnofex Music Player</a>
                    </div>
                    <div class="collapse navbar-collapse">
                        <ul class="nav navbar-nav">
                            <li class="active"><a id="index_link" href="#">Listen</a></li>
                            <li><a id="upload_link" href="#">Upload music</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div id="content-fluid">
                <!-- Music information -->
                <div class="jumbotron">
                    <h2><u>Now playing</u></h2>
                    <p><div id="now_playing"><h2><em>No music selected</em></h2></div></p>
                    <!-- Music controls -->
                    <p>
                        <button type="button" id="play_pause_button" class="btn btn-default"><span class="fa fa-play"></span> Pause/Play</button>
                        <button type="button" id="next_button" class="btn btn-default"><span class="fa fa-step-forward"></span> Next</button>
                        <button type="button" id="random_button" class="btn btn-default"><span class="fa fa-random"></span> Random</button>
                    </p>
                </div>

                <div id="page_content" class="row">
                </div>
            </div>

            <footer>
                <div class="well well-lg text-center">
                    <p>
                        Copyright 2014 - 
                        <a href="mailto:contact@vckb.fr">Thomas Vinckenbosch</a>
                    </p>
                </div>
            </footer>
        </div>
    </div>
    
    <!-- Music player -->
    <audio id="player"></audio>
    
    <!-- Bootstrap JS -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
    <script src="includes/js/bootstrap.min.js"></script>
    <script src="includes/js/jquery.dataTables.min.js"></script>
    <script src="includes/js/dataTables.bootstrap.js"></script>
    <script src="js/ehlnoPlayer.js"></script>
</body>
</html>
