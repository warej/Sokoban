/**
 **
 ** @author: warej
 **
 ** @description: Klasa Loggera wypisująca logi
 **  na ekran.
 **
 **/

function Logger () {

};

Logger.prototype.e = function(msg) {
    var log = document.getElementById("logs").innerHTML;
    //log = msg + log;
    document.getElementById("logs").innerHTML =
        this.time() + "ERROR " + msg + "<br />" + log;
};

Logger.prototype.w = function(msg) {
    var log = document.getElementById("logs").innerHTML;
    //log = msg + log;
    document.getElementById("logs").innerHTML =
        this.time() + "WARN &nbsp;" + msg + "<br />" + log;
};

Logger.prototype.i = function(msg) {
    var log = document.getElementById("logs").innerHTML;
    //log = msg + log;
    document.getElementById("logs").innerHTML =
        this.time() + "INFO  &nbsp;" + msg + "<br />" + log;
};

Logger.prototype.d = function(msg) {
    var log = document.getElementById("logs").innerHTML;
    //log = msg + log;
    document.getElementById("logs").innerHTML =
        this.time() + "DEBUG " + msg + "<br />" + log;
};

Logger.prototype.time = function() {
    time = new Date();
    return "[" + time.toLocaleFormat() + "]# ";
}