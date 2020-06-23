<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;

class HomeController extends Controller
{
    public function useDev(): bool
    {
        try {
            $data = Http::get('http://localhost:8080/dist/main.js');
            return true;
        } catch (\Throwable $ex) {
            return false;
        }
    }

    public function __invoke()
    {

        $isDev = $this->useDev();

        return view('welcome', ['src' => $isDev ? 'http://localhost:8080/dist/main.js' : '/dist/main.js']);
    }
}
