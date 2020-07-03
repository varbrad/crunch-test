<?php

namespace Varbrad\Crunch;

use Illuminate\Support\Facades\File;

class Crunch
{
    public static function entrypoint($name): string
    {
        $path = storage_path('app/crunch.manifest.json');
        $file = json_decode(File::get($path));
        $publicPath = $file->publicPath;
        $scripts = collect($file->entrypoints->$name);
        return $scripts
            ->map(function ($assetName) use ($publicPath) {
                return '<script src="' . $publicPath . $assetName . '" defer></script>';
            })
            ->join('');
    }
}
