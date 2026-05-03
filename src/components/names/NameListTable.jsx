import { useState } from 'react';
import './Names.css';

function NameListTable({ filter, shownNames, isNameUsed, toggleUsed }) {
    const renderFirstTable = () => (
        <table className="table table-condensed table-striped table-hover">
            <thead>
                <tr>
                    <th className="col-form-label">
                        {filter.type === 'race' ? (
                            <span>First Names</span>
                        ) : (
                            <span>First Part</span>
                        )}
                    </th>
                    <th className="col-form-label">Used</th>
                </tr>
            </thead>
            <tbody>
                {shownNames.firstNames.map(name => (
                    <tr key={name}>
                        <td>{name}</td>
                        <td>
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                onChange={() => toggleUsed(name)}
                                checked={isNameUsed(name)}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderSecondTable = () => (
        <table className="table table-condensed table-striped table-hover">
            <thead>
                <tr>
                    <th className="col-form-label">
                        {filter.type === 'race' ? (
                            <span>{shownNames.familyType} Names</span>
                        ) : (
                            <span>Last Part</span>
                        )}
                    </th>
                    <th className="col-form-label">Used</th>
                </tr>
            </thead>
            <tbody>
                {shownNames.lastNames.map(name => (
                    <tr key={name}>
                        <td>{name}</td>
                        <td>
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                onChange={() => toggleUsed(name)}
                                checked={isNameUsed(name)}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className={`list ${filter.type === 'building' || shownNames.familyType != null ? 'names-dualList' : ''}`}>
            {renderFirstTable()}
            {(filter.type === 'building' || shownNames.familyType != null) && renderSecondTable()}
        </div>
    );
}

export default NameListTable;
