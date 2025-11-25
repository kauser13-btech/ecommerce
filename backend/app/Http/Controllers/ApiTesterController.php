<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

class ApiTesterController extends Controller
{
    public function index()
    {
        $routes = Route::getRoutes();
        $groupedRoutes = [];

        // 1. DEFINE YOUR SUGGESTIONS HERE
        // Map the URI (without leading slash) to the sample JSON body
        $payloads = [
            'api/login' => [
                'email' => 'icesiv@gmail.com',
                'password' => 'EggMan-2020'
            ]
        ];

        foreach ($routes as $route) {
            $uri = $route->uri();

            if (!Str::startsWith($uri, 'api')) {
                continue;
            }

            $segments = explode('/', $uri);
            $groupName = isset($segments[1]) ? Str::title($segments[1]) : 'General';
            $method = $route->methods()[0];
            
            // Attach the specific payload if it exists for this URI
            $suggestion = $payloads[$uri] ?? null;

            $groupedRoutes[$groupName][$uri][$method] = [
                'action' => $route->getActionName(),
                'name' => $route->getName(),
                'suggestion' => $suggestion 
            ];
        }

        ksort($groupedRoutes);

        return view('api-tester', [
            'groupedRoutes' => $groupedRoutes,
            'payloads' => $payloads // Pass the dictionary to the view
        ]);
    }
}