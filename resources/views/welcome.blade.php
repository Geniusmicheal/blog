<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Laravel</title>
        <script src="https://kit.fontawesome.com/af1cb1ae49.js" crossorigin="anonymous"></script>
        @viteReactRefresh
        @vite([ 'resources/sass/app.scss', 'resources/js/app.jsx', ])
    </head>
    <body >
    <div id="root"></div>
    </body>

</html>
