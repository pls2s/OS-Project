import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultPage.css'; // Result specific styles

function ResultPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const { numP, numR, allocation, max, available } = location.state || {};
    const [calculationResult, setCalculationResult] = useState(null);

    useEffect(() => {
        if (!location.state) {
            navigate('/');
            return;
        }

        const solveBankers = () => {
            // --- 1. PREPARE DATA (Backend Logic) ---
            const alloc = allocation.map(row => row.map(Number));
            const maxRes = max.map(row => row.map(Number));
            const avail = available.map(Number);
            
            const numProcesses = alloc.length;
            const numResources = avail.length;

            // คำนวณ Need Matrix
            const need = [];
            for (let i = 0; i < numProcesses; i++) {
                const row = [];
                for (let j = 0; j < numResources; j++) {
                    row.push(maxRes[i][j] - alloc[i][j]);
                }
                need.push(row);
            }

            // --- 2. SIMULATION (Banker's Algo) ---
            let work = [...avail];
            const finish = new Array(numProcesses).fill(false);
            const safeSequence = [];
            const logs = []; 

            let count = 0;
            // ใช้ตัวนับรอบ (iteration guard) เพื่อป้องกัน infinite loop ในกรณีที่ระบบไม่ปลอดภัย
            let iterationGuard = 0; 
            const maxIterations = numProcesses * 2; // กำหนดจำนวนรอบสูงสุด

            while (count < numProcesses && iterationGuard < maxIterations) {
                let found = false;
                for (let p = 0; p < numProcesses; p++) {
                    if (!finish[p]) {
                        let canAllocate = true;
                        for (let j = 0; j < numResources; j++) {
                            if (need[p][j] > work[j]) {
                                canAllocate = false;
                                break;
                            }
                        }

                        // Format ข้อความ Array เช่น [ 1, 0, 2 ]
                        const formatArr = (arr) => `[ ${arr.join(', ')} ]`;

                        if (canAllocate) {
                            logs.push({
                                process: `P${p+1}`,
                                status: 'Success', 
                                message: `Need ${formatArr(need[p])} ≤ Work ${formatArr(work)} — รัน P${p+1} สำเร็จ`,
                                workBefore: [...work],
                                needVector: need[p],
                                workVector: work
                            });

                            // ทำการ Release Resource
                            for (let j = 0; j < numResources; j++) {
                                work[j] += alloc[p][j];
                            }
                            logs[logs.length - 1].workAfter = [...work];

                            finish[p] = true;
                            safeSequence.push(`P${p+1}`);
                            found = true;
                            count++;
                        } else {
                            logs.push({
                                process: `P${p+1}`,
                                status: 'Fail',
                                message: `Need ${formatArr(need[p])} > Work ${formatArr(work)} — ไม่สามารถรัน P${p+1} ได้`,
                                workBefore: [...work],
                                needVector: need[p],
                                workVector: work
                            });
                        }
                    }
                }
                if (!found && count < numProcesses) break; // ถ้าวนครบแล้วแต่ยังรันไม่ครบทุก Process แสดงว่าติด Deadlock
                iterationGuard++;
            }

            const isSafe = count === numProcesses;

            // --- 3. PREPARE TABLE DATA (สำหรับแสดงผลตาม Design) ---
            // ฟังก์ชันจัด Format: [ 0, 0, 0 ]
            const formatVector = (arr) => `[ ${arr.join(', ')} ]`;

            const tableData = alloc.map((_, i) => ({
                process: `P${i + 1}`,
                allocation: formatVector(alloc[i]),
                max: formatVector(maxRes[i]),
                need: formatVector(need[i]),
                available: formatVector(avail), 
                finish: finish[i] 
            }));

            setCalculationResult({
                tableData: tableData, 
                steps: logs,
                sequence: safeSequence,
                isSafe: isSafe
            });
        };

        solveBankers();
    }, [allocation, max, available, numP, numR, location.state, navigate]);

    if (!calculationResult) return <div className="setup-container">Loading...</div>;

    const { tableData, steps, sequence, isSafe } = calculationResult;

    return (
        <div className="setup-container" style={{ maxWidth: '1200px' }}> 
            <div className="stepper-bar">
                <div className="step-item is-active"><div className="step-circle">1</div><div className="step-text">step 1</div></div>
                <div className="step-line is-active"></div>
                <div className="step-item is-active"><div className="step-circle">2</div><div className="step-text">step 2</div></div>
                <div className="step-line is-active"></div>
                <div className="step-item is-active"><div className="step-circle">3</div><div className="step-text">step 3</div></div>
            </div>
            {/* Status Banner */}
            <div className={`status-banner ${isSafe ? 'safe' : 'unsafe'}`}>
                {isSafe ? "✅ System is SAFE" : "❌ SYSTEM IS UNSAFE "}
            </div>
            
            <div className="main-input-card">
                
                {/* --- TABLE SECTION (Need Matrix) --- */}
                <div className="table-container result-table-container">
                    <h3>Need Matrix (Max - Allocation)</h3>
                    <div className="resource-table">
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: '10%' }}>Process</th>
                                    <th style={{ width: '20%' }}>Allocation</th>
                                    <th style={{ width: '20%' }}>Max</th>
                                    <th style={{ width: '20%' }}>Need</th>
                                    <th style={{ width: '20%' }}>Available</th>
                                    <th style={{ width: '10%' }}>Finish</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* วนลูปแสดงข้อมูลที่จัด Format มาแล้ว */}
                                {tableData.map((row, index) => (
                                    <tr key={index}>
                                        <td style={{ fontWeight: 'bold' }}>{row.process}</td>
                                        <td>{row.allocation}</td>
                                        <td>{row.max}</td>
                                        <td>{row.need}</td>
                                        <td>{row.available}</td>
                                        {/* Finish Column: ใช้คลาสสำหรับสี */}
                                        <td className={row.finish ? 'finish-true' : 'finish-false'}>
                                            {row.finish.toString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- STEPS SECTION --- */}
                <div className="steps-container">
                    <h3>ขั้นตอนการทำงาน (Banker's Algorithm Simulation)</h3>
                    <ul className="steps-list">
                        {steps.map((step, index) => {
                            const isSuccess = step.status === 'Success';
                            return (
                                <li key={index} className={`step-item-log ${isSuccess ? 'success' : 'fail'}`}>
                                    <div className="step-header">
                                        ตรวจสอบ {step.process} (Iteration {Math.floor(index / numP) + 1})
                                    </div>
                                    <div className="step-detail">
                                        {step.message}
                                    </div>
                                    {isSuccess && step.workBefore && step.workAfter && (
                                        <div className="step-detail" style={{ marginTop: '5px', fontWeight: '500' }}>
                                            Work ก่อน: [ {step.workBefore.join(', ')} ] → Work หลัง: [ {step.workAfter.join(', ')} ]
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* --- SAFE SEQUENCE SECTION --- */}
                <div className="sequence-container">
                    <h3>Safe Sequence</h3>
                    <div className={`sequence-box ${isSafe ? 'safe' : 'unsafe'}`}>
                        {isSafe 
                            ? sequence.join(' → ') 
                            : "ไม่พบ Safe Sequence"
                        }
                    </div>
                </div>

                {/* --- Navigation Buttons --- */}
                <div className="navigation-buttons-in-card">
                    <button className="back-button" onClick={() => navigate(-1)}>Back</button>
                    <button className="next-button" onClick={() => navigate('/setup')}>Restart</button>
                </div>
            </div>
        </div>
    );
}

export default ResultPage;