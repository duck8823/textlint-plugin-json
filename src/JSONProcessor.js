"use strict";

import parse from 'json-to-ast'
import { ASTNodeTypes } from "@textlint/ast-node-types";

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
                ast.type = ASTNodeTypes.Document;
                ast.range = [ast.loc.start.column, ast.loc.end.column];
                ast.children = ast.children.map((child) => {
                    child = child.value;
                    child.type = ASTNodeTypes.Str;
                    child.range = [child.loc.start.column, child.loc.end.column];
                    return child;
                });
                // TODO 再帰的にする
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