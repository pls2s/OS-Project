import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
            while (count < numProcesses) {
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
                                workBefore: [...work]
                            });

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
                                workBefore: [...work]
                            });
                        }
                    }
                }
                if (!found) break; 
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
                // Available ในตารางมักแสดงค่าเริ่มต้น (Initial Available) หรือจะเว้นว่างในแถวอื่นก็ได้ 
                // แต่ตาม Design เหมือนจะโชว์ค่าเดียวกัน หรือค่าเริ่มต้น
                available: formatVector(avail), 
                finish: finish[i].toString() // 'true' หรือ 'false'
            }));

            setCalculationResult({
                tableData: tableData, // ข้อมูลตารางที่จัด Format แล้ว
                steps: logs,
                sequence: safeSequence,
                isSafe: isSafe
            });
        };

        solveBankers();
    }, [allocation, max, available, numP, numR, location.state, navigate]);

    if (!calculationResult) return <div>Loading...</div>;

    const { tableData, steps, sequence, isSafe } = calculationResult;

    return (
        <div className="setup-container" style={{ maxWidth: '1200px' }}> 
            
            {/* Status Banner */}
            <div className={`status-banner ${isSafe ? 'safe' : 'unsafe'}`} 
                 style={{ 
                     padding: '20px', 
                     marginBottom: '20px', 
                     backgroundColor: isSafe ? '#d1fae5' : '#fee2e2', 
                     color: isSafe ? '#065f46' : '#991b1b',
                     borderRadius: '12px',
                     fontWeight: 'bold',
                     fontSize: '24px'
                 }}>
                {isSafe ? "✅ System is SAFE" : "❌ SYSTEM IS UNSAFE"}
            </div>
            
            <div className="main-input-card">
                
                {/* --- TABLE SECTION (NEW DESIGN) --- */}
                <div className="table-container">
                    <h3>Need Matrix (คำนวณจาก Max - Allocation)</h3>
                    <div className="resource-table">
                        <table>
                            <thead>
                                <tr>
                                    {/* หัวข้อตารางตามรูปภาพ */}
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
                                        {/* Finish Column: แสดง true/false */}
                                        <td style={{ 
                                            color: row.finish === 'true' ? '#059669' : '#dc2626', 
                                            fontWeight: '500' 
                                        }}>
                                            {row.finish}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- STEPS SECTION --- */}
                <div className="steps-container" style={{ marginTop: '30px', textAlign: 'left' }}>
                    <h3>ขั้นตอนการทำงาน</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {steps.map((step, index) => {
                            const isSuccess = step.status === 'Success';
                            return (
                                <li key={index} style={{ 
                                    background: isSuccess ? '#ecfdf5' : '#e5e7eb', 
                                    borderLeft: `5px solid ${isSuccess ? '#10b981' : '#6b7280'}`,
                                    padding: '15px', 
                                    marginBottom: '10px', 
                                    borderRadius: '8px',
                                    color: '#1f2937'
                                }}>
                                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                        ตรวจสอบ {step.process}
                                    </div>
                                    <div style={{ fontSize: '14px' }}>
                                        {step.message}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* --- SAFE SEQUENCE SECTION --- */}
                <div className="sequence-container" style={{ marginTop: '30px', textAlign: 'left' }}>
                    <h3>Safe Sequence</h3>
                    <div style={{ 
                        padding: '15px', 
                        background: '#f0fdf4', 
                        borderRadius: '8px',
                        border: '1px solid #1E8E70',
                        color: '#1E8E70',
                        fontWeight: '600',
                        fontSize: '16px'
                    }}>
                        {isSafe 
                            ? sequence.join(' → ') 
                            : "ไม่มี Safe Sequence (Deadlock detected)"
                        }
                    </div>
                </div>

                <div className="navigation-buttons-in-card">
                    <button className="back-button" onClick={() => navigate(-1)}>Back</button>
                    <button className="next-button" onClick={() => navigate('/setup')}>Restart</button>
                </div>
            </div>
        </div>
    );
}

export default ResultPage;