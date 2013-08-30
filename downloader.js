/*	author:	warej
	state:	done
*/
//	Konstruktor klasy odpowiedzialnej za pobieranie plików
function Downloader(callback) {
	this.counter = 0;
	this.finished = 0;
	this.failed = false;
	this.callback = callback;
};

/*	Funkcja dodająca nowy plik do pobieralni */
Downloader.prototype.newFile = function (path, ldr) {
    //  Zwiększ counter plików o 1
	this.counter++;

	// dodaj plik do listy pobierania
	this.files.push({url:path, loader: ldr});
}; /*   Downloader.newFile()    */

/*	Funckja do pobierania danych z podanego URLa	*/
Downloader.prototype.downloadFile = function (url, data, callback, errorCallback) {
    // Set up an asynchronous request
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    // Hook the event that gets called as the request progresses
    request.onreadystatechange = function () {
        // If the request is "DONE" (completed or failed)
        if (request.readyState == 4) {
            // If we got HTTP status 200 (OK)
            if (request.status == 200) {
                callback(request.responseText, data);
            } else { // Failed
                errorCallback(url);
            }
        }
    };

    request.send(null);
}	/*	loadFile()	*/

//	Funkcja rozpoczynająca pobieranie plików
Downloader.prototype.start = function () {
	for (file in this.files) {
		this.downloadFile(file.url, file.loader, this.done, this.error);
	};
};

//	Funkcja wywoływana przy zakończeniu pobierania pliku
Downloader.prototype.done = function (response, loader) {
    //  Kolejny skończony
	this.finished++;

    //  Obsłuż pobrany plik
	loader(response);

	if (this.finished == this.conter) {
		if (this.failed) {
			//	Błąd przy pobieraniu
			alert("Wyst¹pi³ b³¹d przy pobieraniu plików");
		}
		else {
			//	Pobieranie zakończone sukcesem - powrót do programu
			this.callback();
		}
	}
};

//	Funkcja wywoływana w przypadku wystąpienia błędu przy pobieraniu plików
Downloader.prototype.error = function (url) {
	this.failed = true;
	this.finished++;

	if (this.finished == this.conter) {
		alert("Wystąpił błąd przy pobieraniu plików");
	}
};