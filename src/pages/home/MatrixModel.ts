import {BaseModel} from "../../components/models/BaseModel";
import {CallbackValidator} from "../../components/forms/validators/CallbackValidator";
import {NotEmptyValidator} from "../../components/forms/validators/NotEmptyValidator";
import {ICell} from "./Test-app";

export class MatrixModel extends BaseModel {
    numberRows: any = null;
    numberColumns: string = null;
    xValue: string = '0';
    maxXValue: number | string = '0';
    generatedMatrix: any[] = [];
    rowSum: any[] = [];
    colAverage: string[] = [];
    selectedFunction: string = 'find';

    constructor() {
        super();

        this.addValidator('numberRows', new NotEmptyValidator())
            .addValidator('numberColumns', new NotEmptyValidator())
            .addValidator('numberRows', new CallbackValidator(() => this.checkRows(), 'Value have to be more than 0 and less or equal 100'))
            .addValidator('numberColumns', new CallbackValidator(() => this.checkColumns(), 'Value have to be more than 0 and less or equal 100'))
            .addValidator('xValue', new CallbackValidator(() => this.checkMaxXVal()))
    }

    checkMaxXVal() {
        this.calcMaxXValue();
        return parseInt(this.xValue) > 0 && parseInt(this.xValue) < this.maxXValue;
    }

    checkRows(): boolean {
        let intRowsNum = parseInt(this.numberRows);

        return this.numberRows !== null && intRowsNum <= 100 && intRowsNum > 0;
    }

    calcMaxXValue() {
        const calc = parseInt(this.numberRows) * parseInt(this.numberColumns);

        this.maxXValue = !isNaN(calc) ? calc : '0';
    }

    checkColumns(): boolean {
        let intColsNum = parseInt(this.numberColumns);

        return this.numberColumns !== null && intColsNum <= 100 && intColsNum > 0;
    }

    doGenerateTable() {
        this.createTableMatrix(parseInt(this.numberRows), parseInt(this.numberColumns));
    }


    getRandomThreeDigit() {
        // generate a 3 digits random number
        const randomValue = Math.floor(Math.random() * 1000);
        return randomValue.toString().padStart(3, '0');
    }

    doFunction(cell: ICell) {
        if (this.selectedFunction === 'find') {
            this.findNearestCells(cell.value);
        }

        if (this.selectedFunction === 'increase') {
            if (typeof cell.value === "string") {
                cell.value = parseInt(cell.value) + 1;
            } else {
                cell.value = cell.value + 1;
            }
            this.calcAvrRowSums();
        }

        if (this.selectedFunction === 'percents') {

        }
    }

    findNearestCells(value) {
        let nearest = [];
        let diffs = [];
        const matrix = this.generatedMatrix;

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                const diff = Math.abs(matrix[i][j].value - value);
                nearest.push({id: matrix[i][j].id, value: matrix[i][j].value, diff: diff});
                diffs.push(diff);
            }
        }
        nearest.sort((a, b) => a.diff - b.diff);

        const nearestIds = nearest.slice(0, parseInt(this.xValue)).map(item => item.id);

        this.toggleNearest(nearestIds);
    }

    toggleNearest(nearestIds: string[]) {
        const matrix = this.generatedMatrix;

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                matrix[i][j].nearest = nearestIds.includes(matrix[i][j].id);
            }
        }
    }

    calcAvrRowSums() {
        if (!this.generatedMatrix || this.generatedMatrix.length === 0) {
            return;
        }

        //calc total in rows
        this.rowSum = this.generatedMatrix.map((row) => row.reduce((sum, cell) => parseInt(sum) + parseInt(cell.value), 0));

        const colSum = Array.from({length: parseInt(this.numberColumns)}, (_, i) =>
            this.generatedMatrix.reduce((sum, row) => parseInt(sum) + parseInt(row[i].value), 0)
        );

        //calc cell percentage
        this.generatedMatrix.forEach((row, rowIndex) => {
            row.forEach((cell: ICell) => {
                const cellVal = typeof cell.value === "string" ? parseInt(cell.value) : cell.value;

                cell.percentage = ((cellVal / this.rowSum[rowIndex]) * 100).toFixed(2);
            })
        })

        //calc average col sum
        this.colAverage = colSum.map((sum) => (sum / parseInt(this.numberRows)).toFixed(2));
    }

    createTableMatrix(rows: number, cols: number) {
        const objectMatrix = [];

        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
                const cell = {
                    id: i * cols + j,
                    value: this.getRandomThreeDigit(),
                    nearest: false,
                    withPercents: false
                };
                row.push(cell);
            }
            objectMatrix.push(row);
        }

        this.generatedMatrix = objectMatrix;

        this.calcAvrRowSums();
    }

    togglePercentMode(isShow: boolean, hoveredRowIndex: number, cb: Function) {
        this.generatedMatrix.some((row, rowIndex) => {
            if (rowIndex === hoveredRowIndex) {
                row.forEach((cell: any) => {
                    cell.withPercents = isShow;
                })
                return true;
            }
            return false;
        })

        if (cb) {
            cb();
        }
    }

    addRow() {
        this.numberRows = parseInt(this.numberRows) + 1;
        const row = [];

        for (let i = 0; i < parseInt(this.numberColumns); i++) {
            const cell = {
                id: i * parseInt(this.numberColumns) + 'tmp' + Math.random(),
                value: this.getRandomThreeDigit(),
                nearest: false,
                withPercents: false
            };
            row.push(cell);
        }
        this.generatedMatrix.push(row);
        this.calcAvrRowSums();
    }

    removeRow(indexRow: number, clearInputs: Function) {
        let splicedIndex = null;

        this.generatedMatrix.some((row, index) => {
            if (index === indexRow) {
                splicedIndex = String(index);
                return true;
            }
            return false;
        })

        if (splicedIndex) {
            this.generatedMatrix.splice(splicedIndex, 1);
            this.numberRows = parseInt(this.numberRows) - 1;
            this.calcAvrRowSums();
        }
        if (this.generatedMatrix.length === 0) {
            this.colAverage = [];
            if (clearInputs) {
                clearInputs();
            }
        }
    }
}
