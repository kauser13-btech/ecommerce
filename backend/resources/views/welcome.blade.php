<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name') }}</title>
        
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="h-screen w-full flex flex-col justify-center items-center bg-gray-50">

        <div class="mb-8">
            <img src="{{ asset('logo.jpg') }}" alt="Logo" class="h-60 w-auto">
        </div>

        <a href="{{ url('/api-tester') }}" 
           class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1">
            Go to API Explorer
        </a>

    </body>
</html>