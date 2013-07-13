/*	author:	warej
	state:	done
*/
//	Konstruktor klasy odpowiedzialnej za pobieranie plik�w
function Downloader(callback) {
	this.counter = 0;
	this.finished = 0;
	this.failed = false;
	this.callback = callback;
};

//	Funkcja dodaj�ca nowy plik do pobieralni
Downloader.prototype.newFile = function (path, ldr) {
	this.counter++;
	// dodaj plik do pobierania
	this.files.push({url:path, loader: ldr});
};

//	Funkcja rozpoczynaj�ca pobieranie plik�w
Downloader.prototype.start = function () {
	foreach (file in this.list) {
		loadFile(file.url, file.loader, this.done, this.error);
	};
};

//	Funkcja wywo�ywana przy zako�czeniu pobierania pliku
Downloader.prototype.done = function (response, loader) {
	this.finished++;
	loader(response);
	
	if (this.finished == this.conter) {
		if (!this.failed) {
			//	B��d przy pobieraniu
			alert("Wyst�pi� b��d przy pobieraniu plik�w");
		}
		else {
			//	Pobieranie zako�czone sukcesem
			//	Obs�uga zako�czenia
			this.callback();
		}
	}
};

//	Funkcja wywo�ywana w przypadku b��du przy pobieraniu plik�w
Downloader.prototype.error = function (url) {
	this.failed = true;
	this.finished++;
	
	if (this.finished == this.conter) {
		alert("Wyst�pi� b��d przy pobieraniu plik�w");
	}
};