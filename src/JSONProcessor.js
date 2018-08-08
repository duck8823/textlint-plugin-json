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

// from
// {
//   "key": "value",
//   "nested": {
//     "nested_key": "nested_value"
//   },
//   "array": [
//     {
//       "array_obj_key": "array_obj_value"
//     },
//     "array_value"
//   ]
// }
//
// to
// {
//   "type": "Document",
//   "children": [
//     {
//       "type": "Document",
//       "loc": {
//         "start": {
//           "line": 2,
//           "column": 3,
//           "offset": 4
//         },
//         "end": {
//           "line": 2,
//           "column": 17,
//           "offset": 18
//         },
//         "source": null
//       },
//       "children": [
//         {
//           "type": "Str",
//           "value": "key",
//           "raw": "\"key\"",
//           "loc": {
//             "start": {
//               "line": 2,
//               "column": 3,
//               "offset": 4
//             },
//             "end": {
//               "line": 2,
//               "column": 8,
//               "offset": 9
//             },
//             "source": null
//           },
//           "range": [
//             4,
//             9
//           ]
//         },
//         {
//           "type": "Str",
//           "value": "value",
//           "raw": "\"value\"",
//           "loc": {
//             "start": {
//               "line": 2,
//               "column": 10,
//               "offset": 11
//             },
//             "end": {
//               "line": 2,
//               "column": 17,
//               "offset": 18
//             },
//             "source": null
//           },
//           "range": [
//             11,
//             18
//           ]
//         }
//       ],
//       "range": [
//         4,
//         18
//       ]
//     },
//     {
//       "type": "Document",
//       "loc": {
//         "start": {
//           "line": 3,
//           "column": 3,
//           "offset": 22
//         },
//         "end": {
//           "line": 5,
//           "column": 4,
//           "offset": 70
//         },
//         "source": null
//       },
//       "children": [
//         {
//           "type": "Str",
//           "value": "nested",
//           "raw": "\"nested\"",
//           "loc": {
//             "start": {
//               "line": 3,
//               "column": 3,
//               "offset": 22
//             },
//             "end": {
//               "line": 3,
//               "column": 11,
//               "offset": 30
//             },
//             "source": null
//           },
//           "range": [
//             22,
//             30
//           ]
//         },
//         {
//           "type": "Document",
//           "children": [
//             {
//               "type": "Document",
//               "loc": {
//                 "start": {
//                   "line": 4,
//                   "column": 5,
//                   "offset": 38
//                 },
//                 "end": {
//                   "line": 4,
//                   "column": 33,
//                   "offset": 66
//                 },
//                 "source": null
//               },
//               "children": [
//                 {
//                   "type": "Str",
//                   "value": "nested_key",
//                   "raw": "\"nested_key\"",
//                   "loc": {
//                     "start": {
//                       "line": 4,
//                       "column": 5,
//                       "offset": 38
//                     },
//                     "end": {
//                       "line": 4,
//                       "column": 17,
//                       "offset": 50
//                     },
//                     "source": null
//                   },
//                   "range": [
//                     38,
//                     50
//                   ]
//                 },
//                 {
//                   "type": "Str",
//                   "value": "nested_value",
//                   "raw": "\"nested_value\"",
//                   "loc": {
//                     "start": {
//                       "line": 4,
//                       "column": 19,
//                       "offset": 52
//                     },
//                     "end": {
//                       "line": 4,
//                       "column": 33,
//                       "offset": 66
//                     },
//                     "source": null
//                   },
//                   "range": [
//                     52,
//                     66
//                   ]
//                 }
//               ],
//               "range": [
//                 38,
//                 66
//               ]
//             }
//           ],
//           "loc": {
//             "start": {
//               "line": 3,
//               "column": 13,
//               "offset": 32
//             },
//             "end": {
//               "line": 5,
//               "column": 4,
//               "offset": 70
//             },
//             "source": null
//           },
//           "range": [
//             32,
//             70
//           ]
//         }
//       ],
//       "range": [
//         22,
//         70
//       ]
//     },
//     {
//       "type": "Document",
//       "loc": {
//         "start": {
//           "line": 6,
//           "column": 3,
//           "offset": 74
//         },
//         "end": {
//           "line": 11,
//           "column": 4,
//           "offset": 160
//         },
//         "source": null
//       },
//       "children": [
//         {
//           "type": "Str",
//           "value": "array",
//           "raw": "\"array\"",
//           "loc": {
//             "start": {
//               "line": 6,
//               "column": 3,
//               "offset": 74
//             },
//             "end": {
//               "line": 6,
//               "column": 10,
//               "offset": 81
//             },
//             "source": null
//           },
//           "range": [
//             74,
//             81
//           ]
//         },
//         {
//           "type": "List",
//           "children": [
//             {
//               "type": "Document",
//               "children": [
//                 {
//                   "type": "Document",
//                   "loc": {
//                     "start": {
//                       "line": 8,
//                       "column": 7,
//                       "offset": 97
//                     },
//                     "end": {
//                       "line": 8,
//                       "column": 41,
//                       "offset": 131
//                     },
//                     "source": null
//                   },
//                   "children": [
//                     {
//                       "type": "Str",
//                       "value": "array_obj_key",
//                       "raw": "\"array_obj_key\"",
//                       "loc": {
//                         "start": {
//                           "line": 8,
//                           "column": 7,
//                           "offset": 97
//                         },
//                         "end": {
//                           "line": 8,
//                           "column": 22,
//                           "offset": 112
//                         },
//                         "source": null
//                       },
//                       "range": [
//                         97,
//                         112
//                       ]
//                     },
//                     {
//                       "type": "Str",
//                       "value": "array_obj_value",
//                       "raw": "\"array_obj_value\"",
//                       "loc": {
//                         "start": {
//                           "line": 8,
//                           "column": 24,
//                           "offset": 114
//                         },
//                         "end": {
//                           "line": 8,
//                           "column": 41,
//                           "offset": 131
//                         },
//                         "source": null
//                       },
//                       "range": [
//                         114,
//                         131
//                       ]
//                     }
//                   ],
//                   "range": [
//                     97,
//                     131
//                   ]
//                 }
//               ],
//               "loc": {
//                 "start": {
//                   "line": 7,
//                   "column": 5,
//                   "offset": 89
//                 },
//                 "end": {
//                   "line": 9,
//                   "column": 6,
//                   "offset": 137
//                 },
//                 "source": null
//               },
//               "range": [
//                 89,
//                 137
//               ]
//             },
//             {
//               "type": "Str",
//               "value": "array_value",
//               "raw": "\"array_value\"",
//               "loc": {
//                 "start": {
//                   "line": 10,
//                   "column": 5,
//                   "offset": 143
//                 },
//                 "end": {
//                   "line": 10,
//                   "column": 18,
//                   "offset": 156
//                 },
//                 "source": null
//               },
//               "range": [
//                 143,
//                 156
//               ]
//             }
//           ],
//           "loc": {
//             "start": {
//               "line": 6,
//               "column": 12,
//               "offset": 83
//             },
//             "end": {
//               "line": 11,
//               "column": 4,
//               "offset": 160
//             },
//             "source": null
//           },
//           "range": [
//             83,
//             160
//           ]
//         }
//       ],
//       "range": [
//         74,
//         160
//       ]
//     }
//   ],
//   "loc": {
//     "start": {
//       "line": 1,
//       "column": 1,
//       "offset": 0
//     },
//     "end": {
//       "line": 12,
//       "column": 2,
//       "offset": 162
//     },
//     "source": null
//   },
//   "range": [
//     0,
//     162
//   ]
// }