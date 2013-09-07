/*	author:	warej
	state:	done
*/
//	Konstruktor klasy odpowiedzialnej za pobieranie plików
function Downloader(callback, context) {
	this.counter = 0;
	this.finished = 0;
	this.failed = false;
	this.callback = callback;
    this.context = context;
    this.files = [];
};

/*	Funkcja dodająca nowy plik do pobieralni */
Downloader.prototype.newFile = function (path, ldr) {
    //  Zwiększ counter plików o 1
	this.counter++;

	// dodaj plik do listy pobierania
	this.files.push({url: path, loader: ldr});
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
};	/*	loadFile()	*/

//	Funkcja rozpoczynająca pobieranie plików
Downloader.prototype.start = function () {
    if (this.counter > 0) {
    log.i("Rozpoczynam pobieranie.");
    	for (file in this.files) {
            log.d("Pobieram plik " + file.url);
    		this.downloadFile(file.url, file.loader, this.done, this.error);
    	};
        log.i("Zakończyłem pobieranie.");
    }
    else {
    	log.i("Nie ma nic do pobrania.");
        this.callback.apply(this.context);
    }
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
			log.e("Wystąpią błąd przy pobieraniu plików");
    		$("#loadingPage").hide();
		}
		else {
			//	Pobieranie zakończone sukcesem - powrót do programu
			this.callback.apply(this.context);
		}
	}
};

//	Funkcja wywoływana w przypadku wystąpienia błędu przy pobieraniu plików
Downloader.prototype.error = function (url) {
    log.e("Nie udało się pobrać pliku " + url);
	this.failed = true;
	this.finished++;

	if (this.finished == this.conter) {
		log.e("Wystąpił błąd przy pobieraniu plików.");
		$("#loadingPage").hide();
	}
};