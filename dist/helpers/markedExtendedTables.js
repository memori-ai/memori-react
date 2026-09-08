"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1() {
    return {
        extensions: [
            {
                name: 'spanTable',
                level: 'block',
                start(src) {
                    var _a;
                    return (_a = src.match(/^\n *([^\n ].*\|.*)\n/)) === null || _a === void 0 ? void 0 : _a.index;
                },
                tokenizer(src, tokens) {
                    const regex = new RegExp('^ *([^\\n ].*\\|.*\\n(?: *[^\\s].*\\n)*?)' +
                        ' {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?' +
                        '(?:\\n((?:(?! *\\n| {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})' +
                        '(?:\\n+|$)| {0,3}#{1,6} | {0,3}>| {4}[^\\n]| {0,3}(?:`{3,}' +
                        '(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n| {0,3}(?:[*+-]|1[.)]) |' +
                        '<\\/?(?:address|article|aside|base|basefont|blockquote|body|' +
                        'caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?: +|\\n|\\/?>)|<(?:script|pre|style|textarea|!--)).*(?:\\n|$))*)\\n*|$)');
                    const cap = regex.exec(src);
                    if (cap) {
                        const item = {
                            type: 'spanTable',
                            header: cap[1].replace(/\n$/, '').split('\n'),
                            align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                            rows: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : [],
                        };
                        item.header[0] = splitCells(item.header[0]);
                        const colCount = item.header[0].reduce((length, header) => {
                            return length + header.colspan;
                        }, 0);
                        if (colCount === item.align.length) {
                            item.raw = cap[0];
                            let i, j, k, row;
                            let l = item.align.length;
                            for (i = 0; i < l; i++) {
                                if (/^ *-+: *$/.test(item.align[i])) {
                                    item.align[i] = 'right';
                                }
                                else if (/^ *:-+: *$/.test(item.align[i])) {
                                    item.align[i] = 'center';
                                }
                                else if (/^ *:-+ *$/.test(item.align[i])) {
                                    item.align[i] = 'left';
                                }
                                else {
                                    item.align[i] = null;
                                }
                            }
                            l = item.header.length;
                            for (i = 1; i < l; i++) {
                                item.header[i] = splitCells(item.header[i], colCount, item.header[i - 1]);
                            }
                            l = item.rows.length;
                            for (i = 0; i < l; i++) {
                                item.rows[i] = splitCells(item.rows[i], colCount, item.rows[i - 1]);
                            }
                            l = item.header.length;
                            for (j = 0; j < l; j++) {
                                row = item.header[j];
                                for (k = 0; k < row.length; k++) {
                                    row[k].tokens = [];
                                    this.lexer.inline(row[k].text, row[k].tokens);
                                }
                            }
                            l = item.rows.length;
                            for (j = 0; j < l; j++) {
                                row = item.rows[j];
                                for (k = 0; k < row.length; k++) {
                                    row[k].tokens = [];
                                    this.lexer.inline(row[k].text, row[k].tokens);
                                }
                            }
                            return item;
                        }
                    }
                },
                renderer(token) {
                    let i, j, row, cell, col, text;
                    let output = '<div class="memori--responsive-table-wrapper"><table class="memori--table memori--table--compact">';
                    output += '<thead>';
                    for (i = 0; i < token.header.length; i++) {
                        row = token.header[i];
                        let col = 0;
                        output += '<tr>';
                        for (j = 0; j < row.length; j++) {
                            cell = row[j];
                            text = this.parser.parseInline(cell.tokens);
                            output += getTableCell(text, cell, 'th', token.align[col]);
                            col += cell.colspan;
                        }
                        output += '</tr>';
                    }
                    output += '</thead>';
                    if (token.rows.length) {
                        output += '<tbody>';
                        for (i = 0; i < token.rows.length; i++) {
                            row = token.rows[i];
                            col = 0;
                            output += '<tr>';
                            for (j = 0; j < row.length; j++) {
                                cell = row[j];
                                text = this.parser.parseInline(cell.tokens);
                                output += getTableCell(text, cell, 'td', token.align[col]);
                                col += cell.colspan;
                            }
                            output += '</tr>';
                        }
                        output += '</tbody>';
                    }
                    output += '</table></div>';
                    return output;
                },
            },
        ],
    };
}
exports.default = default_1;
const getTableCell = (text, cell, type, align) => {
    if (!cell.rowspan) {
        return '';
    }
    const tag = `<${type}` +
        `${cell.colspan > 1 ? ` colspan=${cell.colspan}` : ''}` +
        `${cell.rowspan > 1 ? ` rowspan=${cell.rowspan}` : ''}` +
        `${align ? ` align=${align}` : ''}>`;
    return `${tag + text}</${type}>\n`;
};
const splitCells = (tableRow, count, prevRow = []) => {
    var _a, _b, _c;
    const cells = [...tableRow.matchAll(/(?:[^|\\]|\\.?)+(?:\|+|$)/g)].map(x => x[0]);
    if (!((_a = cells[0]) === null || _a === void 0 ? void 0 : _a.trim())) {
        cells.shift();
    }
    if (!((_b = cells[cells.length - 1]) === null || _b === void 0 ? void 0 : _b.trim())) {
        cells.pop();
    }
    let numCols = 0;
    let i, j, trimmedCell, prevCell, prevCols;
    for (i = 0; i < cells.length; i++) {
        trimmedCell = cells[i].split(/\|+$/)[0];
        cells[i] = {
            rowspan: 1,
            colspan: Math.max(cells[i].length - trimmedCell.length, 1),
            text: trimmedCell.trim().replace(/\\\|/g, '|'),
        };
        if (trimmedCell.slice(-1) === '^' && prevRow.length) {
            prevCols = 0;
            for (j = 0; j < prevRow.length; j++) {
                prevCell = prevRow[j];
                if (prevCols === numCols && prevCell.colspan === cells[i].colspan) {
                    cells[i].rowSpanTarget = (_c = prevCell.rowSpanTarget) !== null && _c !== void 0 ? _c : prevCell;
                    cells[i].rowSpanTarget.text += ` ${cells[i].text.slice(0, -1)}`;
                    cells[i].rowSpanTarget.rowspan += 1;
                    cells[i].rowspan = 0;
                    break;
                }
                prevCols += prevCell.colspan;
                if (prevCols > numCols) {
                    break;
                }
            }
        }
        numCols += cells[i].colspan;
    }
    if (numCols > count) {
        cells.splice(count);
    }
    else {
        while (numCols < count) {
            cells.push({
                colspan: 1,
                text: '',
            });
            numCols += 1;
        }
    }
    return cells;
};
//# sourceMappingURL=markedExtendedTables.js.map