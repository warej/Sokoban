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

Logger.prototype.d = function(msg) {
    var log = document.getElementById("logs").innerHTML;
    //log = msg + log;
    document.getElementById("logs").innerHTML =
        this.time() + "DEBUG" + msg + "<br />" + log;
};

Logger.prototype.time = function() {
    time = new Date();
    return "[" + time.toLocaleFormat() + "]# ";
}