import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './InputResourcePage.css';

function InputResourcePage() {
    const location = useLocation();
    const navigate = useNavigate();

    const numP = location.state?.numP || 3;
    const numR = location.state?.numR || 3;

    const [allocation, setAllocation] = useState(
        Array.from({ length: numP }, () => Array(numR).fill(''))
    );
    const [max, setMax] = useState(
        Array.from({ length: numP }, () => Array(numR).fill(''))
    );
    const [available, setAvailable] = useState(Array(numR).fill(''));

    const [error, setError] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const resourceHeaders = Array.from({ length: numR }, (_, i) => String.fromCharCode(65 + i));
    const processRows = Array.from({ length: numP }, (_, i) => `P${i + 1}`);

    const handleInputChange = (e, rowIndex, colIndex, type) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return;

        if (type === 'allocation') {
            const newAlloc = [...allocation];
            newAlloc[rowIndex][colIndex] = value;
            setAllocation(newAlloc);
        } else if (type === 'max') {
            const newMax = [...max];
            newMax[rowIndex][colIndex] = value;
            setMax(newMax);
        } else if (type === 'available') {
            const newAvail = [...available];
            newAvail[colIndex] = value;
            setAvailable(newAvail);
        }

        if (error) setError(null);
    };

    const handleKeyDown = (e, rowIndex, colIndex, type) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            let nextId = '';

            if (type === 'available') {
                if (colIndex < numR - 1) {
                    nextId = `avail-0-${colIndex + 1}`;
                }
            } else {
                if (colIndex < numR - 1) {
                    nextId = `${type}-${rowIndex}-${colIndex + 1}`;
                } else if (rowIndex < numP - 1) {
                    nextId = `${type}-${rowIndex + 1}-0`;
                }
            }

            if (nextId) {
                const nextElement = document.getElementById(nextId);
                if (nextElement) nextElement.focus();
            }
        }
    };

    const resetTable = (type) => {
        if (type === 'allocation') {
            setAllocation(Array.from({ length: numP }, () => Array(numR).fill('')));
        } else if (type === 'max') {
            setMax(Array.from({ length: numP }, () => Array(numR).fill('')));
        } else if (type === 'available') {
            setAvailable(Array(numR).fill(''));
        }
        if (error) setError(null);
        setIsSubmitted(false);
    };

    const handleNext = () => {
        setIsSubmitted(true);

        const isAllocEmpty = allocation.some(row => row.some(cell => cell === ''));
        const isMaxEmpty = max.some(row => row.some(cell => cell === ''));
        const isAvailEmpty = available.some(cell => cell === '');

        if (isAllocEmpty || isMaxEmpty || isAvailEmpty) {
            setError("ตรวจสอบข้อมูลอีกครั้ง : กรุณากรอกข้อมูลให้ครบถ้วน");
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            return;
        }

        console.log("Data Ready:", { allocation, max, available });
        alert("ไปกันต่อเลย! (ยังไม่พัฒนาไอสั..)");
    };

    const handleBack = () => {
        navigate("/setup");
    };

    const getInputClass = (value) => {
        return `table-input ${isSubmitted && value === '' ? 'input-error' : ''}`;
    };

    return (
        <div className="setup-container">
            <div className="stepper-bar">
                <div className="step-item is-active"><div className="step-circle">1</div><div className="step-text">step 1</div></div>
                <div className="step-line is-active"></div>
                <div className="step-item is-active"><div className="step-circle">2</div><div className="step-text">step 2</div></div>
                <div className="step-line"></div>
                <div className="step-item"><div className="step-circle">3</div><div className="step-text">step 3</div></div>
            </div>

            <h2 className="main-title">ขั้นตอนที่ 2 — กรอกข้อมูล Allocation, Max และ Available</h2>
            <p className="subtitle">ระบุขนาดคอลัมน์ตามจำนวน Resource types ({numR}) และแถวตามจำนวน Process ({numP})</p>

            <div className="main-input-card">
                
                <div className="table-container">
                    <h3>1) กรอกข้อมูล Allocation</h3>
                    <div className="resource-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Process</th>
                                    {resourceHeaders.map(h => <th key={h}>{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {processRows.map((process, rIndex) => (
                                    <tr key={process}>
                                        <td>{process}</td>
                                        {resourceHeaders.map((header, cIndex) => (
                                            <td key={header}>
                                                <input
                                                    id={`allocation-${rIndex}-${cIndex}`}
                                                    type="text"
                                                    value={allocation[rIndex][cIndex]}
                                                    onChange={(e) => handleInputChange(e, rIndex, cIndex, 'allocation')}
                                                    onKeyDown={(e) => handleKeyDown(e, rIndex, cIndex, 'allocation')}
                                                    className={getInputClass(allocation[rIndex][cIndex])}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="reset-link" onClick={() => resetTable('allocation')}>Reset Table</div>
                </div>

                <div className="table-container">
                    <h3>2) กรอกข้อมูล Max</h3>
                    <div className="resource-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Process</th>
                                    {resourceHeaders.map(h => <th key={h}>{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {processRows.map((process, rIndex) => (
                                    <tr key={process}>
                                        <td>{process}</td>
                                        {resourceHeaders.map((header, cIndex) => (
                                            <td key={header}>
                                                <input
                                                    id={`max-${rIndex}-${cIndex}`}
                                                    type="text"
                                                    value={max[rIndex][cIndex]}
                                                    onChange={(e) => handleInputChange(e, rIndex, cIndex, 'max')}
                                                    onKeyDown={(e) => handleKeyDown(e, rIndex, cIndex, 'max')}
                                                    className={getInputClass(max[rIndex][cIndex])}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="reset-link" onClick={() => resetTable('max')}>Reset Table</div>
                </div>

                <div className="table-container">
                    <h3>3) กรอกข้อมูล Available</h3>
                    <div className="resource-table available-table">
                        <table>
                            <thead>
                                <tr>
                                    {resourceHeaders.map(h => <th key={h}>{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {resourceHeaders.map((header, cIndex) => (
                                        <td key={header}>
                                            <input
                                                id={`avail-0-${cIndex}`}
                                                type="text"
                                                value={available[cIndex]}
                                                onChange={(e) => handleInputChange(e, 0, cIndex, 'available')}
                                                onKeyDown={(e) => handleKeyDown(e, 0, cIndex, 'available')}
                                                className={getInputClass(available[cIndex])}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="reset-link" onClick={() => resetTable('available')}>Reset Table</div>
                </div>

                {error && (
                    <div className="error-banner">
                        {error}
                    </div>
                )}

                <div className="navigation-buttons-in-card">
                    <button onClick={handleBack} className="back-button">Back</button>
                    <button onClick={handleNext} className="next-button">Next</button>
                </div>
            </div>
        </div>
    );
}

export default InputResourcePage;