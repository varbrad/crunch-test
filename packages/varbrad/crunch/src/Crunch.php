<?php

namespace Varbrad\Crunch;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;

class Crunch
{
    public static function entrypoint($name): string
    {
        $manifest = self::getManifest();
        $config = self::getConfig();

        $publicPath = $config->publicPath ?? '/dist/';
        $port = $config->dev->port ?? 8080;

        $localhost = "http://localhost:$port";

        // Is the HTTP server up?!?!?!
        try {
            $resp = Http::get($localhost);
            $isUp = $resp->getStatusCode() === 200;

            if ($isUp) {
                return "<script src=\"$localhost$publicPath$name.js\"></script>";
            }
        } catch (\Throwable $e) {}

        $scripts = collect($manifest->entrypoints->$name);
        return $scripts
            ->map(function ($assetName) use ($publicPath) {
                return '<script src="' . $publicPath . $assetName . '" defer></script>';
            })
            ->join('');
    }

    public static function getManifest(): object
    {
        return self::getJson(storage_path('app/crunch.manifest.json'));
    }

    public static function getConfig(): object
    {
        return self::getJson(base_path('crunch.config.json'));
    }

    public static function getJson(string $path): object
    {
        return json_decode(File::get($path));
    }
}
