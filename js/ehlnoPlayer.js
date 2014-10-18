/* 
 * Copyright Thomas Vinckenbosch
 *     thomas@vckb.fr
 */


/*
 * I. TABLE CREATION
 */

// Clear the content inside the table body
function clearTableContent(tableNode) {
    tableBody = document.getElementById('playlist_table');
    
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
    
    return tableNode;
}

// Insert the <thead> node
function insertTableHead(tableNode) {
    theadElement = document.createElement('thead');
    
    trElement = document.createElement('tr');
    
    tableHeaders = ['', 'Title', 'Album', 'Artist', 'Playlist'];
    for (var i = 0; i < tableHeaders.length; i++) {
        thElement = document.createElement('th');
        thElement.innerHTML = tableHeaders[i];
        trElement.appendChild(thElement);
    }
    
    theadElement.appendChild(trElement);
    
    tableNode.appendChild(theadElement);
    return tableNode;
}

// Insert the <tbody> node (without rows)
function insertTableBody(tableNode) {
    var tableBody = document.createElement('tbody');
    tableBody.setAttribute('id', 'playlist_table');
    
    tableNode.appendChild(tableBody);
    return tableNode;
}

// Populate <tbody> rows from the JSON response
function populateMusicTable(response) {
    var jsonResponse = JSON.parse(response);
    
    clearTableContent(document.getElementById('music_list_table'));
    var tableBody = document.getElementById('playlist_table');
    
    for (var id in jsonResponse) {
        var result = jsonResponse[id];
        
        tableRow = document.createElement('tr');
        tableRow.setAttribute('data-mpeg', result['path']);
        tableRow.setAttribute('data-id', id);
        
        rowButton = document.createElement('td');
        rowButton.innerHTML = '<button type="button" class="play_this btn btn-default" click="playItem(this.parentNode)"><span class="fa fa-play"></span></button>';
        tableRow.appendChild(rowButton);
        
        rowTitle = document.createElement('td');
        rowTitle.innerHTML = result['title'];
        tableRow.appendChild(rowTitle);
        
        rowAlbum = document.createElement('td');
        rowAlbum.innerHTML = result['album'];
        tableRow.appendChild(rowAlbum);
        
        rowArtist = document.createElement('td');
        rowArtist.innerHTML = result['artist'];
        tableRow.appendChild(rowArtist);
        
        rowPlaylist = document.createElement('td');
        rowPlaylist.innerHTML = '<button class="btn btn-default modal-opener" data-target="#man-modal"><span class="fa fa-pencil"></span></button>';
        tableRow.appendChild(rowPlaylist);
        
        tableBody.appendChild(tableRow);
    }
    
    return tableBody;
}

// An AJAX function to get the music
// On result, populate the <tbody>
function getMusicList(artistName, albumName, playlists) {
    
    var sendUrl = 'get_music.php';
    if (artistName || albumName || playlists) {
        sendUrl += '?';
        if (artistName !== '') {
            sendUrl += 'artist=' + artistName;
        }
        if (albumName !== '') {
            if (artistName !== '') {
                sendUrl += '&';
            }
            sendUrl += 'album=' + albumName;
        }
        if (playlists !== '') {
            if (artistName !== '' || albumName !== '') {
                sendUrl += '&';
            }
            sendUrl += 'playlist=' + playlists;
        }
    }
    
    var xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)) {
            // Get response text in json and populate
            populateMusicTable(xhr.responseText);
            addPlayButtonsToTable();
            if (player.src !== '') {
                setSelected(player.getAttribute('src'));
            }
            $('#music_list_table').dataTable();
        }
    };
    
    xhr.open('GET', sendUrl, true);
    xhr.send(null);
}

// Create a new <table> node in the 'page_content'
function insertTableNode(contentNode) {
    var table = document.createElement('table');
    table.setAttribute('id', 'music_list_table');
    table.setAttribute('class', 'table table-striped');
    
    contentNode.appendChild(table);
    return table;
}

// Add "play" buttons to each table row
function addPlayButtonsToTable() {
    var play_this_buttons_list = document.getElementsByClassName('play_this');
    //console.log('Adding play buttons, length = ' + play_this_buttons_list.length);
    for (var i = 0; i < play_this_buttons_list.length; ++i) {
        //console.log('Button ' + i);
        play_this_buttons_list[i].addEventListener('click', function() {
            // The <tr> node containing the 'data-mpeg' attribute
            titleData = this.parentNode.parentNode;
            playItem(titleData);
        });
    }
}

// Set the row which is loaded in the player as "selected"
function setSelected(src) {
    var tableBody = document.getElementById('playlist_table');
    var children = tableBody.childNodes;
    for (var i = 0; i < children.length; i++) {
        if (children[i].getAttribute('data-mpeg') === src) {
            children[i].classList.add('selected');
            children[i].classList.add('selected-row');
            break;
        }
    }
}

/*
 * II. UPLOAD FORM CREATION
 */

// AJAX function which get the content for the upload form
function getForm() {
    var xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)) {
            var contentNode = document.getElementById('page_content');
            contentNode.innerHTML = xhr.responseText;
            $('#uploadAlert').hide();
            setSubmitFunction();
        }
    };
    
    xhr.open('GET', 'upload.php', true);
    xhr.send(null);
}

function setSubmitFunction() {
    var upload_form = document.getElementById('upload_form');
    
    upload_form.onsubmit = function(e) {
        var file_input = document.getElementById('fileInput');
        var upload_button = document.getElementById('upload_button');
        
        // Check the form
        if (!checkForm()) {
            $('#uploadAlert').show();
            return false;
        }
        
        // Display grey out
        document.getElementById('player_layer').style.display = '';
        
        e.preventDefault();
    
        upload_button.innerHTML = 'Uploading...';
    
        var files = file_input.files;
        var formData = new FormData(upload_form);
        for (var i = 0; i < files.length; ++i) {
            var file = files[i];
            //if (!file.type.match('audio.*')) {
            //    continue;
            //}
            formData.append('uploaded_file', file, file.name);
        }
    
        var xhr = new XMLHttpRequest();
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)) {
                document.getElementById('player_layer').style.display = 'none';
                upload_button.innerHTML = 'Submit';
                console.log('Finished with response: ' + xhr.responseText);
            } else {
                console.log('ReadyState: ' + xhr.readyState);
                console.log('Status: ' + xhr.status);
            }
        };
    
        xhr.open('POST', 'process_upload.php', true);
        xhr.send(formData);
        
        resetForm();

        return false;
    };
}

/*
 * III. FORM PROCESSING
 */

// Check the form fields
function checkForm() {
    var alert_message = document.getElementById('alert-content');
    alert_message.innerHTML = '';
    var form_ok = true;
    var file_field = document.getElementById('fileInput');
    if (file_field.value === null || file_field.value === '') {
        alert_message.innerHTML += "You must select a file to upload<br />";
        file_field.parentNode.classList.add('has-error');
        form_ok = false;
    }
    
    var title_field = document.getElementById('titleInput');
    if (title_field.value === null || title_field.value === '') {
        alert_message.innerHTML += "You must specify the song title<br />";
        title_field.parentNode.classList.add('has-error');
        form_ok = false;
    }
    
    var album_field = document.getElementById('albumInput');
    if (album_field.value === null || album_field.value === '') {
        alert_message.innerHTML += "You must specify the song album<br />";
        album_field.parentNode.classList.add('has-error');
        form_ok = false;
    }
    
    var art_field = document.getElementById('artistInput');
    if (art_field.value === null || art_field.value === '') {
        alert_message.innerHTML += "You must specify the song artist<br />";
        art_field.parentNode.classList.add('has-error');
        form_ok = false;
    }
    
    return form_ok;
}

// Clear the form fields
function resetForm() {
    var file_field = document.getElementById('fileInput');
    file_field.value = null;
    file_field.parentNode.classList.remove('has-error');
    
    var title_field = document.getElementById('titleInput');
    title_field.value = null;
    title_field.parentNode.classList.remove('has-error');
    
    var album_field = document.getElementById('albumInput');
    album_field.value = null;
    album_field.parentNode.classList.remove('has-error');
        
    var art_field = document.getElementById('artistInput');
    art_field.value = null;
    art_field.parentNode.classList.remove('has-error');
    
    return true;
}

/*
 * IV. AUDIO PLAYER
 */

var player = document.getElementById('player');

// Set the "now playing" infos
function setPlayerInfo(titleData) {
    var infos = document.getElementById('now_playing');
    
    var titleInfo = titleData.childNodes[1].childNodes[0].textContent;
    var artistInfo = titleData.childNodes[3].childNodes[0].textContent;
    
    infos.innerHTML = '<h2><span class="fa fa-music"></span> <em>' + titleInfo + '</em></h2>';
    infos.innerHTML += '<h3><span class="fa fa-user"></span> ' + artistInfo + '</h3>';
}

// Display the "paused" info if the player is paused
function setPauseInfo(setPause) {
    var infos = document.getElementById('now_playing');
    
    if (setPause) {
        infos.innerHTML += '<h4>(Paused)</h4>';
    } else {
        for (var i = 0; i < infos.childNodes.length; i++) {
            if (infos.childNodes[i].nodeName === 'H4') {
                infos.removeChild(infos.childNodes[i]);
                break;
            }
        }
    }
}

// Play selected song title
function playItem(titleData) {
    var playlist = document.getElementById('playlist_table');
    
    // Change the "selected" status
    var selected = playlist.querySelector(".selected");
    if (selected) {
        selected.classList.remove("selected");
    }
    titleData.classList.add('selected');

    if (player.getAttribute('src') !== titleData.getAttribute('data-mpeg')) {
        // Set the button as active
        var selected_button = playlist.querySelector(".active");
        if (selected_button) {
            selected_button.classList.remove("active");
        }
        titleData.childNodes[0].childNodes[0].classList.add("active");
        
        // Display the "now playing"
        setPlayerInfo(titleData);

        // Set background
        var selected_line = playlist.querySelector(".selected-row");
        if (selected_line) {
            selected_line.classList.remove("selected-row");
        }
        titleData.classList.add("selected-row");
        
        // Load audio player source and play it
        player.src = titleData.getAttribute("data-mpeg");
        player.play();
    }
}

// Play the next song
function playNext() {
    var playlist = document.getElementById('playlist_table');
    
    // Get the current playing titleData
    var selected = playlist.querySelector("tr.selected");
    
    if (selected && selected.nextSibling) {
        // Play the next item in the table
        playItem(selected.nextSibling);
    } else if (selected && !selected.nextSibling) {
        // No more items in the table, play the first one
        var playlist = document.getElementById('playlist_table');
        playItem(playlist.childNodes[0]);
    }
}

// Play or Pause the audio player
function playPauseAudio() {
    if (!player.paused) {
        player.pause();
        setPauseInfo(true);
    } else {
        if (player.src !== '') {
            player.play();
            setPauseInfo(false);
        }
    }
}

// Play a random song in the music list in the table
function playRandom() {
    var musicList = document.getElementsByClassName('play_this');
    
    var rand = Math.floor(Math.random() * musicList.length);
    
    while (player.getAttribute('src')
            && player.getAttribute('src') === musicList[rand].parentNode.parentNode.getAttribute('data-mpeg')) {
        rand = Math.floor(Math.random() * musicList.length);
    }
    
    setPlayerInfo(musicList[rand].parentNode.parentNode);
    playItem(musicList[rand].parentNode.parentNode);
}

// Set the listeners for the player
function setPlayerListeners() {
    player.addEventListener('ended', playNext);
    player.addEventListener('click', playNext);
    
    var playPause = document.getElementById('play_pause_button');
    playPause.addEventListener('click', playPauseAudio);
    
    var next = document.getElementById('next_button');
    next.addEventListener('click', playNext);
    
    var random = document.getElementById('random_button');
    random.addEventListener('click', playRandom);
}

/*
 * V. FILES AND PLAYLISTS MANAGEMENT
 */

function setModalTitle(title, artist, album) {
    document.getElementById('modal-header-title').innerHTML = title + ' - '
            + artist + ' - ' + album;
}

function createPlaylistSelector(playlist_name, selected) {
    plElement = document.createElement('li');
    plElement.setAttribute('data-pl', playlist_name);
    
    checkElement = document.createElement('input');
    checkElement.setAttribute('type', 'checkbox');
    checkElement.checked = selected;
    plElement.appendChild(checkElement);
    
    spanElement = document.createElement('span');
    spanElement.innerHTML = playlist_name;
    plElement.appendChild(spanElement);
    
    buttonElement = document.createElement('button');
    buttonElement.setAttribute('data-name', playlist_name);
    buttonElement.setAttribute('class', 'btn btn-danger btn-sm');
    buttonSpanElement = document.createElement('span');
    buttonSpanElement.setAttribute('class', 'fa fa-times');
    buttonElement.appendChild(buttonSpanElement);
    plElement.appendChild(buttonElement);
    
    buttonElement.addEventListener('click', function(e) {
        var inputId = $(this).parent().parent().attr('data-id');
        var pl_name = $(this).attr('data-name');
        if (pl_name !== '') {
            var sendUrl = 'delete_playlist.php?name=' + pl_name;
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)) {
                    // Get response text in json and update modal
                    var xhr2 = new XMLHttpRequest();
                    xhr2.onreadystatechange = function () {
                        if (xhr2.readyState === 4 && (xhr2.status === 200 || xhr2.status === 0)) {
                            // Get response text in json and update modal
                            var jsonResponse = JSON.parse(xhr2.responseText);
                            setModalBody(jsonResponse);
                        }
                    };
                    xhr2.open('GET', 'get_music.php?id=' + inputId, true);
                    xhr2.send(null);
                }
            };
            xhr.open('GET', sendUrl, true);
            xhr.send(null);
        }
    });
    
    return plElement;
}

function setModalBody(jsonData) {
    document.getElementById('modal-body').innerHTML = '';
    var music_id = jsonData['music']['_id']['$id'];
    
    plListElement = document.createElement('ul');
    plListElement.setAttribute('data-id', music_id);
    
    for (var plId in jsonData['playlist']) {
        var result = jsonData['playlist'][plId];
        
        var selected = false;
        for (var i = 0; i < result['songs'].length; i++) {
            if (result['songs'][i]['$id'] === music_id) {
                selected = true;
            }
        }
        
        plListElement.appendChild(createPlaylistSelector(result['name'],
                                                         selected));
    }
    
    plElement = document.createElement('li');
    plElement.setAttribute('data-pl', '');
    plElement.setAttribute('data-action', '');

    inputElement = document.createElement('input');
    inputElement.setAttribute('type', 'text');
    plElement.appendChild(inputElement);

    buttonElement = document.createElement('button');
    buttonElement.setAttribute('data-id', jsonData['music']['_id']['$id']);
    buttonElement.setAttribute('class', 'btn btn-default btn-sm');
    buttonSpanElement = document.createElement('span');
    buttonSpanElement.setAttribute('class', 'fa fa-plus');
    buttonElement.appendChild(buttonSpanElement);
    plElement.appendChild(buttonElement);

    plListElement.appendChild(plElement);

    buttonElement.addEventListener('click', function(e) {
        var inputId = e.target.getAttribute('data-id');
        var inputValue = $(this).parent().children().first().val();
        if (inputValue !== '') {
            // Add new playlist
            var sendUrl = 'add_playlist.php?name=' + inputValue;
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)) {
                    // Get response text in json and update modal
                    var xhr2 = new XMLHttpRequest();
                    xhr2.onreadystatechange = function () {
                        if (xhr2.readyState === 4 && (xhr2.status === 200 || xhr2.status === 0)) {
                            // Get response text in json and update modal
                            var jsonResponse = JSON.parse(xhr2.responseText);
                            setModalBody(jsonResponse);
                        }
                    };
                    xhr2.open('GET', 'get_music.php?id=' + inputId, true);
                    xhr2.send(null);
                }
            };
            xhr.open('GET', sendUrl, true);
            xhr.send(null);
        }
    });
    
    document.getElementById('modal-body').appendChild(plListElement);
}

function setModalListeners() {
    $(document).on('click', '.modal-opener', function () {
        var rowNode = $(this).parent().parent();
        var data_id = rowNode.attr('data-id');

        var sendUrl = 'get_music.php?id=' + data_id;

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)) {
                // Get response text in json and show modal
                var jsonResponse = JSON.parse(xhr.responseText);
                setModalTitle(jsonResponse['music']['title'], jsonResponse['music']['artist'], jsonResponse['music']['album']);
                setModalBody(jsonResponse);
                $('#man-modal').modal('show');
            }
        };
        xhr.open('GET', sendUrl, true);
        xhr.send(null);
    });
    
    document.getElementById('modal-delete').addEventListener('click', function() {
        var content = document.getElementById('modal-body');
        
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)) {
                var content = document.getElementById('page_content');
                content.innerHTML = '';
                var tableNode = insertTableNode(document.getElementById('page_content'));
                tableNode = insertTableHead(tableNode);
                tableNode = insertTableBody(tableNode);
                getMusicList('', '', '');
                $('#man-modal').modal('hide');
            }
        };
        xhr.open('GET',
                 'delete_song.php?id=' + content.childNodes[0].getAttribute('data-id'),
                 true);
        xhr.send(null);
    });
    
    document.getElementById('modal-update').addEventListener('click', function() {
        var content = document.getElementById('modal-body');
        var elementList = content.childNodes[0];
        
        var jsonObj = new Object();
        jsonObj['id'] = elementList.getAttribute('data-id');
        jsonObj['playlists'] = [];
        for (var i = 0; i < elementList.childNodes.length - 1; i++) {
            jsonObj['playlists'].push({
                'name': elementList.childNodes[i].childNodes[1].innerHTML,
            'selected': elementList.childNodes[i].childNodes[0].checked
            });
        }
        
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 0)) {
                $('#man-modal').modal('hide');
            }
        };
        xhr.open('POST', 'update_playlist.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send('jsonObj=' + JSON.stringify(jsonObj));
    });
}

/*
 * VI. PAGE SWITCHING
 */

// Set the listeners for the navbar links
function setSwitchListeners() {
    var upload_link = document.getElementById('upload_link');
    var index_link = document.getElementById('index_link');
    
    var main = document.getElementById('main_link');
    main.addEventListener('click', function() {
        upload_link.parentNode.classList.remove('active');
        index_link.parentNode.classList.add('active');
        var content = document.getElementById('page_content');
        content.innerHTML = '';
        var tableNode = insertTableNode(document.getElementById('page_content'));
        tableNode = insertTableHead(tableNode);
        tableNode = insertTableBody(tableNode);
        getMusicList('', '', '');
    });
    
    var index = document.getElementById('index_link');
    index.addEventListener('click', function() {
        upload_link.parentNode.classList.remove('active');
        index_link.parentNode.classList.add('active');
        var content = document.getElementById('page_content');
        content.innerHTML = '';
        var tableNode = insertTableNode(document.getElementById('page_content'));
        tableNode = insertTableHead(tableNode);
        tableNode = insertTableBody(tableNode);
        getMusicList('', '', '');
    });
    
    var upload = document.getElementById('upload_link');
    upload.addEventListener('click', function() {
        upload_link.parentNode.classList.add('active');
        index_link.parentNode.classList.remove('active');
        var content = document.getElementById('page_content');
        content.innerHTML = '';
        getForm();
    });
}

/*
 * VII. ON FIRST LAUNCH
 */
getMusicList();
var tableNode = insertTableNode(document.getElementById('page_content'));
tableNode = insertTableHead(tableNode);
tableNode = insertTableBody(tableNode);
setSwitchListeners();
setPlayerListeners();
setModalListeners();
