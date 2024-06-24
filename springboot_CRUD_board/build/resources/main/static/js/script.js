document.addEventListener("DOMContentLoaded", function() {
    var message = window.message || 'default message';
    var searchUrl = window.searchUrl || 'defaultSearchUrl';
    alert(message);
    location.replace(searchUrl);
});
