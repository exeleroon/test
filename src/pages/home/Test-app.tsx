import React, {Component} from "react";
import {MatrixModel} from "./MatrixModel";

export interface ICell {
    id: number;
    value: string | number;
    nearest: boolean;
    withPercents: boolean;
    percentage: string | number;
    bgStyle: any
}

class TestApp extends Component {
    matrixModel: MatrixModel;

    mValRef: React.RefObject<any>;
    nValRef: React.RefObject<any>;
    xValRef: React.RefObject<any>;

    constructor(props) {
        super(props);

        this.matrixModel = new MatrixModel();
        this.mValRef = React.createRef();
        this.nValRef = React.createRef();
        this.xValRef = React.createRef();

        this.createTable = this.createTable.bind(this);
        this.toggleDoFunc = this.toggleDoFunc.bind(this);
        this.clearInputs = this.clearInputs.bind(this);

    }

    clearInputs() {
        if (this.mValRef && this.nValRef && this.xValRef) {
            this.mValRef.current.value = '';
            this.nValRef.current.value = '';
            this.xValRef.current.value = '';
        }
    }

    createTable(): void {
        if (!this.matrixModel.isValid()) {
            this.setState({});
            return;
        }
        this.matrixModel.doGenerateTable();
        this.setState({});
    }

    toggleDoFunc(funcType: string) {
        this.matrixModel.selectedFunction = funcType;
    }


    render() {

        return (
            <div className={'home'}>
                <div className={'home-inputs mb-5'}>
                    <div className={'home-inputs-container'}>
                        <label htmlFor="mValue">Number of rows</label>
                        <input
                            min="0"
                            max="100"
                            name={'mValue'}
                            type={'number'}
                            ref={this.mValRef}
                            onBlur={_ => {
                                this.matrixModel.calcMaxXValue();
                                this.setState({});
                            }}
                            onChange={e => this.matrixModel.numberRows = e.target.value}
                        />
                        {this.matrixModel.getFieldError('numberRows') &&
                            <div className={'input-error'}>{this.matrixModel.getFieldError('numberRows')}</div>
                        }
                    </div>

                    <div className={'home-inputs-container'}>
                        <label htmlFor="nValue">Number of columns</label>
                        <input
                            min="0"
                            max="100"
                            name={'nValue'}
                            type={'number'}
                            ref={this.nValRef}
                            onBlur={_ => {
                                this.matrixModel.calcMaxXValue();
                                this.setState({});
                            }}
                            onChange={e => this.matrixModel.numberColumns = e.target.value}
                        />
                        {this.matrixModel.getFieldError('numberColumns') &&
                            <div className={'input-error'}>{this.matrixModel.getFieldError('numberColumns')}</div>
                        }
                    </div>

                    <div className={'home-inputs-container'}>
                        <label htmlFor="xValue">xValue</label>
                        <input
                            min="0"
                            max={this.matrixModel.maxXValue}
                            name={'xValue'}
                            type={'number'}
                            ref={this.xValRef}
                            onChange={e => this.matrixModel.xValue = e.target.value}
                        />
                        {this.matrixModel.getFieldError('xValue') &&
                            <div className={'input-error'}>
                                {this.matrixModel.getFieldError('xValue') && `xValue have to more than 0 and less than ${this.matrixModel.maxXValue}`}
                            </div>
                        }
                    </div>

                    <button className={'btn'} onClick={_ => this.createTable()}>Generate table</button>
                </div>

                <div style={{overflow: this.matrixModel.generatedMatrix.length > 0 ? 'scroll' : 'hidden'}}
                     className={'table-container'}>
                    <div className={'radio-box d-flex'}>
                        <div className={'me-3'}>
                            <input type="radio" name="tableFunc"
                                   onChange={_ => {
                                       this.matrixModel.selectedFunction = 'increase';
                                       this.setState({});
                                   }} id="increase"
                                   value="increase"
                                   checked={this.matrixModel.selectedFunction === 'increase'}
                            />
                            <label className={'ms-2'} htmlFor="increase">Increase clicked cell by 1</label>
                        </div>

                        <div>
                            <input type="radio" id="find"
                                   onChange={_ => {
                                       this.matrixModel.selectedFunction = 'find';
                                       this.setState({});
                                   }} name="tableFunc"
                                   value="find"
                                   checked={this.matrixModel.selectedFunction === 'find'}
                            />
                            <label className={'ms-2'}
                                   htmlFor="find">Find {this.matrixModel.xValue !== '0' ? this.matrixModel.xValue : 'xValue'} closest
                                cells to clicked cell in table</label>
                        </div>
                    </div>

                    <table>
                        {this.matrixModel.generatedMatrix.length > 0 && <thead>
                        <tr>
                            <td></td>
                            {Array.from({length: parseInt(this.matrixModel.numberColumns)}, (_, i) => (
                                <td key={`column-${i}`}><b>Cell values N = {i + 1}</b></td>
                            ))}
                            <td><b>Sum Values</b></td>
                        </tr>
                        </thead>}

                        <tbody>
                        {this.matrixModel.generatedMatrix.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <td><b>Cell values M = {rowIndex + 1}</b></td>

                                {row.map((cell: ICell) => {
                                    return (
                                        <td className={`td-value ${cell.nearest ? 'nearest' : ''}`}
                                            style={{background: cell.withPercents ? `linear-gradient(to right, #a40909 ${cell.percentage}%, yellow ${cell.percentage}%, green ${cell.percentage}%)` : ''}}
                                            key={cell.id}
                                            onClick={_ => {
                                                this.matrixModel.doFunction(cell);
                                                this.setState({});
                                            }}>
                                            <p>{cell.value} {cell.withPercents ? ' > ' + cell.percentage + '%' : ''}</p>
                                        </td>
                                    )
                                })}

                                <td className={'td-value'}
                                    onMouseEnter={() => {
                                        this.matrixModel.togglePercentMode(true, rowIndex, () => this.setState({}));
                                    }}
                                    onMouseLeave={() => {
                                        this.matrixModel.togglePercentMode(false, rowIndex, () => this.setState({}));
                                        this.setState({});
                                    }}
                                >
                                    {this.matrixModel.rowSum[rowIndex]}
                                </td>
                                <td onClick={_ => {
                                    this.matrixModel.removeRow(rowIndex, () => this.clearInputs());
                                    this.setState({});
                                }} className={'td-remove'}>Remove row
                                </td>
                            </tr>
                        ))}
                        </tbody>

                        {this.matrixModel.colAverage.length > 0 && <tfoot>
                        <tr>
                            <td><b>Average values</b></td>
                            {this.matrixModel.colAverage.map((sum, columnIndex) => (
                                <td className={'td-value'} key={`column-sum-${columnIndex}`}>{sum}</td>
                            ))}
                            <td></td>
                            <td onClick={_ => {
                                this.matrixModel.addRow();
                                this.setState({});
                            }} className={'td-add'}>Add row
                            </td>
                        </tr>
                        </tfoot>}
                    </table>
                </div>
            </div>
        );
    }
}

export default TestApp;
