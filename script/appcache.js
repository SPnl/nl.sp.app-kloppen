/*jshint
    camelcase:false, trailing:true */
/*jslint
    plusplus:true */
/*globals
    window, confirm */

(function () {
    'use strict';

    // Based on http://www.html5rocks.com/en/tutorials/appcache/beginner/
    // Check if a newer version than the cached one is available
    window.applicationCache.addEventListener('updateready', function () {
        if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
            if (confirm('Er is een nieuwe versie van deze app. Nu de pagina verversen om die te laden?')) {
                window.location.reload();
            }
        }
    });

}());