import React from 'react';
import PropTypes from 'prop-types';
import './PMStyle.css';

export default class PMTable extends React.Component {

    constructor(props) {
        super();

        this.state = {
            caption: props.caption,
            header: props.header,
            data: props.data,
            sortby: null,
            descending: false,
            error: null,
            currentColumn: 1,
        };
        this.onClick = this.onClick.bind(this);
        this.handleNextColumn = this.handleNextColumn.bind(this);
        this.handlePreviousColumn = this.handlePreviousColumn.bind(this);
    }

    componentDidMount() {
        fetch('http://localhost:3000/horario')
            .then(response => response.json())
            .then(json => {
                this.setState({
                    caption: json.caption,
                    header: json.header,
                    data: json.data
                });
            })
            .catch(error => {
                console.error(error);
                this.setState({ error: 'Não foi possível carregar os dados. Atualize a página e tente novamente.' });
            });
    }


    onClick = (event) => {
        const column = event.target.tagName.toUpperCase() === 'TH' ? event.target.cellIndex : -1;
        const data = Array.from(this.state.data);
        const descending = this.state.sortby === column && !this.state.descending;
        data.sort((a, b) => {
            if (a[column] === b[column]) {
                return 0;
            }
            return descending
                ? a[column] < b[column]
                    ? 1
                    : -1
                : a[column] > b[column]
                    ? 1
                    : -1;
        });
        this.setState({
            data,
            sortby: column,
            descending,
            edit: {
                row: -1,
                column: -1,
            }
        });
    }

    handleNextColumn = () => {
        this.setState(prevState => ({
            currentColumn: Math.min(prevState.currentColumn + 1, this.state.header.length - 1)
        }));
    }

    handlePreviousColumn = () => {
        this.setState(prevState => ({
            currentColumn: Math.max(prevState.currentColumn - 1, 1)
        }));
    }

    render() {
        if (this.state.error) {
            return <div>{this.state.error}</div>;
        }
        const caption = 'caption' in this.state ? this.state.caption : this.props.caption;
        const data = 'data' in this.state ? this.state.data : this.props.data;
        const header = this.state.header.map((title, idx) => {
            if (this.state.sortby === idx) {
                title += this.state.descending ? ' \u2191' : ' \u2193';
            }
            return title;

        });

        const tableStyle = {
            border: '1px solid black',
            borderCollapse: 'collapse',
            width: '100%',
            textAlign: 'left',
            backgroundColor: '#f1f1f1',
        };

        const thStyle = {
            border: '1px solid black',
            padding: '10px',
            backgroundColor: '#a31211',
            color: 'white',
        };

        const tdStyle = {
            border: '1px solid black',
            padding: '10px',
        };

        const captionStyle = {
            border: '1px solid black',
            padding: '10px',
            backgroundColor: 'gray',
            color: 'white',
            fontSize: '20px',
        };
        const buttonStyle = {
                
        }



        return (
            <table style={tableStyle} >
                <caption style={captionStyle}>{caption}</caption>
                <thead onClick={this.onClick}>
                    <tr>
                        {header.map((title, idx) => {
                            const cellClass = (idx !== 0 && idx !== this.state.currentColumn) ? 'hide-on-mobile' : '';
                            return <th className={cellClass} style={thStyle} key={idx}>{title}</th>;
                        })}
                    </tr>
                </thead>
                <tbody >
                    {
                        data.map((row, rowidx) => {
                            return (
                                <tr key={rowidx} data-row={rowidx}>
                                    {
                                        row.map((cell, columnidx) => {
                                            const cellClass = (columnidx !== 0 && columnidx !== this.state.currentColumn) ? 'hide-on-mobile' : '';
                                            return <td className={cellClass} style={tdStyle} onClick={this.onResetTable} key={columnidx}>{cell}</td>;
                                        })
                                    }
                                </tr>
                            );
                        })
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <td>
                            <button style={buttonStyle} className="hide-on-desktop" onClick={this.handlePreviousColumn}>Anterior</button>
                            <button style={buttonStyle} className="hide-on-desktop" onClick={this.handleNextColumn}>Próximo</button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        );
    }
}



PMTable.propTypes = {
    caption: PropTypes.string.isRequired,
    header: PropTypes.array,
    data: PropTypes.array,
};
PMTable.defaultProps = {
    caption: 'Table',
    header: [],
    data: [],
};