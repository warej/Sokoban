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

//	Funkcja dodaj¹ca nowy plik do pobieralni
Downloader.prototype.newFile = function (path, ldr) {
	this.counter++;
	// dodaj plik do pobierania
	this.files.push({url:path, loader: ldr});
};

//	Funkcja rozpoczynaj¹ca pobieranie plików
Downloader.prototype.start = function () {
	foreach (file in this.list) {
		loadFile(file.url, file.loader, this.done, this.error);
	};
};

//	Funkcja wywo³ywana przy zakoñczeniu pobierania pliku
Downloader.prototype.done = function (response, loader) {
	this.finished++;
	loader(response);
	
	if (this.finished == this.conter) {
		if (!this.failed) {
			//	B³¹d przy pobieraniu
			alert("Wyst¹pi³ b³¹d przy pobieraniu plików");
		}
		else {
			//	Pobieranie zakoñczone sukcesem
			//	Obs³uga zakoñczenia
			this.callback();
		}
	}
};

//	Funkcja wywo³ywana w przypadku b³êdu przy pobieraniu plików
Downloader.prototype.error = function (url) {
	this.failed = true;
	this.finished++;
	
	if (this.finished == this.conter) {
		alert("Wyst¹pi³ b³¹d przy pobieraniu plików");
	}
};