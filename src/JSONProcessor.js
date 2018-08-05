"use strict";

import parse from 'json-to-ast'

export class JSONProcessor {
    constructor(config = {}) {
        this.config = config;
    }

    availableExtensions() {
        return [ ".json" ].concat(this.config.extensions ? this.config.extensions : []);
    }

    processor(_extension) {
        return {
            preProcess(text) {
                let ast = parse(text);
                ast.children = ast.children.map((child) => {
                    child.range = [child.loc.start.column, child.loc.end.column];
                    return child;
                });
                // TODO parse for textlint
                return ast;
            },
            postProcess(messages, filePath) {
                return {
                    messages,
                    filePath: filePath ? filePath : "<json>"
                };
            }
        };
    }
}