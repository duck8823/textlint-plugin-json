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
                ast = convert(ast);
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

function convert(node) {
    switch (node.type) {
        case "Object":
            node.type = ASTNodeTypes.Document;
            node.children = node.children.map((child) => {
               return convert(child);
            });
            break;
        case "Property":
            node.type = ASTNodeTypes.Document;
            node.children = [
                convert(node.key),
                convert(node.value)
            ];
            delete node.key;
            delete node.value;
            break;
        case "Array":
            node.type = ASTNodeTypes.List;
            node.children = node.children.map((child) => {
               return convert(child);
            });
            break;
        case "Identifier":
            node.type = ASTNodeTypes.Str;
            break;
        case "Literal":
            node.type = ASTNodeTypes.Str;
            break;
        default:
            // nothing to do
            break;
    }
    node.range = [node.loc.start.offset, node.loc.end.offset];
    return node
}