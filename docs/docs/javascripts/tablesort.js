document$.subscribe(function() {
  var tables = document.querySelectorAll("article table:not([class])")
  tables.forEach(function(table) {
    new Tablesort(table)
  })
})

$( '.contributors img[data-src]' ).each( function() {
    src = $(this).attr("data-src");
    $(this).attr('src',src);
});