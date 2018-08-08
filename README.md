# textlint-plugin-json
Add JSON support for [textlint](https://github.com/textlint/textlint "textlint").

What is textlint plugin? Please see https://github.com/textlint/textlint/blob/master/docs/plugin.md


## Installation

    npm install textlint-plugin-json

## Default supported extensions

- `.json`

## Usage

Manually add text plugin to do following:

```
{
    "plugins": [
        "json"
    ]
}
```

Lint JSON file with textlint

```
$ textlint messages.json
```

### Options
 - `extensions`: `string[]`
    - Additional file extensions for json

For example, if you want to treat `.custom-ext` as JSON, put following config to `.textlintrc`

 ```json
{
    "plugins": {
        "json": {
            "extensions": [".custom-ext"]
        }
    }
}
```

## License

MIT
