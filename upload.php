<!-- Upload -->
<div id="uploadAlert" class="alert alert-danger alert-dismissible" role="alert">
    <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
    <div id="alert-content"></div>
</div>
<h2><span class="fa fa-upload"></span> <u>Upload your music</u></h2>
<form id="upload_form" name="upload_form" role="form" enctype="multipart/form-data" method="post">
    <div class="form-group">
        <label for="fileInput">File</label>
        <input type="file" name="uploaded_file" id="fileInput" accept="audio/*">
        <p class="help-block">Please select a *.mp3 file.</p>
    </div>
    <div class="form-group">
        <label for="titleInpput">Song title</label>
        <input type="text" name="title" id="titleInput" placeholder="Enter song title" class="form-control">
    </div>
    <div class="form-group">
        <label for="albumInput">Album</label>
        <input type="text" name="album" id="albumInput" placeholder="Enter album name" class="form-control">
    </div>
    <div class="form-group">
        <label for="artistInput">Artist</label>
        <input type="text" name="artist" id="artistInput" placeholder="Enter artist's name" class="form-control">
    </div>
    <button type="submit" id="upload_button" class="btn btn-default">Submit</button>
</form>
<div id="player_layer" class="grey_layer" style="display:none"><i class="fa fa-spinner fa-spin fa-5x" style="position: fixed; top: 50%; left: 50%"></i></div>
