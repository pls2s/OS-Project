import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ResultPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // 1. รับข้อมูลจากหน้า InputResourcePage (ถ้าไม่มีข้อมูล ดีดกลับไปหน้าแรก)
    const { numP, numR, allocation, max, available } = location.state || {};

    // 2. State สำหรับเก็บผลลัพธ์การคำนวณ เพื่อส่งให้ พีระพอร์ช
    const [calculationResult, setCalculationResult] = useState(null);

    useEffect(() => {
        if (!location.state) {
            navigate('/'); // ถ้าไม่มีข้อมูลให้กลับไปหน้าแรก
            return;
        }

        // --- เริ่มต้นส่วน LOGIC คำนวณ ---
        const solveBankers = () => {
            // แปลงข้อมูลทั้งหมดเป็นตัวเลข (เพราะ input มาเป็น string)
            const alloc = allocation.map(row => row.map(Number));
            const maxRes = max.map(row => row.map(Number));
            const avail = available.map(Number);
            
            const numProcesses = alloc.length;
            const numResources = avail.length;

            // 1. หา Need Matrix (Need = Max - Allocation)
            const need = [];
            for (let i = 0; i < numProcesses; i++) {
                const row = [];
                for (let j = 0; j < numResources; j++) {
                    row.push(maxRes[i][j] - alloc[i][j]);
                }
                need.push(row);
            }

            // 2. จำลองการทำงาน (Simulation)
            let work = [...avail]; // Work เริ่มต้นเท่ากับ Available
            const finish = new Array(numProcesses).fill(false);
            const safeSequence = [];
            const logs = []; // เก็บขั้นตอนการทำงานเพื่อเอาไปโชว์ใน UI

            let count = 0;
            while (count < numProcesses) {
                let found = false;
                
                for (let p = 0; p < numProcesses; p++) {
                    if (!finish[p]) {
                        // เช็คว่า Need <= Work หรือไม่
                        let canAllocate = true;
                        for (let j = 0; j < numResources; j++) {
                            if (need[p][j] > work[j]) {
                                canAllocate = false;
                                break;
                            }
                        }

                        if (canAllocate) {
                            // บันทึก Log ก่อนทำงาน ไอพอร์ชชชช เอาไปโชว์
                            logs.push({
                                process: `P${p+1}`,
                                need: [...need[p]],
                                workBefore: [...work],
                                status: 'Success', // ทำงานสำเร็จ
                                message: `Need ${JSON.stringify(need[p])} <= Work ${JSON.stringify(work)} -> True`
                            });

                            // อัปเดต Work (คืน Resource)
                            for (let j = 0; j < numResources; j++) {
                                work[j] += alloc[p][j];
                            }

                            finish[p] = true;
                            safeSequence.push(`P${p+1}`);
                            found = true;
                            count++;

                            // บันทึก Work หลังจบ
                            logs[logs.length - 1].workAfter = [...work];
                        }
                    }
                }

                if (!found) {
                    // ถ้าวนลูปแล้วไม่เจอ Process ไหนทำได้เลย -> Deadlock (Unsafe)
                    break;
                }
            }

            // 3. สรุปผล
            const isSafe = count === numProcesses;

            setCalculationResult({
                needMatrix: need,      // ตาราง Need
                steps: logs,           // ขั้นตอนการทำงาน (Array)
                sequence: safeSequence,// ลำดับ Safe Sequence (เช่น ['P1', 'P3'])
                isSafe: isSafe         // สถานะระบบ (True/False)
            });
        };

        solveBankers();
    }, [allocation, max, available, numP, numR, location.state, navigate]);

    if (!calculationResult) return <div>Loading Calculation...</div>;

    // ดึงตัวแปรออกมาใช้ง่ายๆ
    const { needMatrix, steps, sequence, isSafe } = calculationResult;
    const resourceHeaders = Array.from({ length: numR }, (_, i) => String.fromCharCode(65 + i));

    // --- ส่วน UI ไอพอร์ชดูนี้ ---
    return (
        <div className="setup-container" style={{ maxWidth: '1200px' }}> 
            
            {/* --- SECTION 1: STATUS BANNER --- */}
            {/* FRONTEND TEAM: 
                - ใช้ตัวแปร {isSafe} เช็คสถานะ
                - ถ้า isSafe === true ให้โชว์กรอบสีเขียว (System is SAFE)
                - ถ้า isSafe === false ให้โชว์กรอบสีแดง (SYSTEM IS UNSAFE)
            */}
            <div className={`status-banner ${isSafe ? 'safe' : 'unsafe'}`} 
                 style={{ 
                     padding: '20px', 
                     marginBottom: '20px', 
                     backgroundColor: isSafe ? '#d1fae5' : '#fee2e2', 
                     color: isSafe ? '#065f46' : '#991b1b',
                     borderRadius: '12px',
                     textAlign: 'center',
                     fontWeight: 'bold',
                     fontSize: '24px'
                 }}>
                {isSafe ? "✅ System is SAFE" : "❌ SYSTEM IS UNSAFE"}
            </div>

            
            <div className="main-input-card">
                
                {/* --- SECTION 2: NEED MATRIX TABLE --- */}
                {/* FRONTEND TEAM: 
                   - วนลูป render ตาราง Need Matrix จากตัวแปร {needMatrix}
                */}
                <div className="table-container">
                    <h3>Need Matrix (คำนวณจาก Max - Allocation)</h3>
                    <div className="resource-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Process</th>
                                    {/* Header A, B, C... */}
                                    {resourceHeaders.map(h => <th key={h}>{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {needMatrix.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        <td>{`P${rowIndex + 1}`}</td>
                                        {/* ข้อมูลในแต่ละช่องของ Need */}
                                        {row.map((val, colIndex) => (
                                            <td key={colIndex}>{val}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- SECTION 3: STEPS / LOGS --- */}
                {/* FRONTEND TEAM:
                   - ตรงนี้คือ "ขั้นตอนการทำงาน" ที่เป็น Timeline
                   - วนลูปตัวแปร {steps} เพื่อแสดงแต่ละขั้นตอน
                */}
                <div className="steps-container" style={{ marginTop: '30px', textAlign: 'left' }}>
                    <h3>ขั้นตอนการทำงาน</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {steps.map((step, index) => (
                            <li key={index} style={{ 
                                background: '#f3f4f6', 
                                padding: '15px', 
                                marginBottom: '10px', 
                                borderRadius: '8px',
                                borderLeft: '5px solid #1E8E70'
                            }}>
                                {/* ตัวอย่างการแสดงผล: ตรวจสอบ P1 */}
                                <strong>ตรวจสอบ {step.process}</strong> <br/>
                                
                                {/* แสดง Logic: Need <= Work */}
                                <span style={{ fontSize: '14px', color: '#555' }}>
                                    Need {JSON.stringify(step.need)} ≤ Work {JSON.stringify(step.workBefore)}
                                    &nbsp; —&gt; <span style={{ color: 'green' }}>True</span> (ทำงานได้)
                                </span>
                                <br/>
                                
                                {/* แสดงผลลัพธ์: Work อัปเดตเป็นอะไร */}
                                <span style={{ fontSize: '12px', color: '#888' }}>
                                    New Work = {JSON.stringify(step.workAfter)}
                                </span>
                            </li>
                        ))}
                        
                        {/* ถ้า Unsafe ให้โชว์ข้อความปิดท้ายว่าไปต่อไม่ได้ */}
                        {!isSafe && (
                            <li style={{ 
                                background: '#fee2e2', 
                                padding: '15px', 
                                borderRadius: '8px',
                                borderLeft: '5px solid #991b1b',
                                color: '#991b1b'
                            }}>
                                ⛔ ไม่สามารถหา Process ถัดไปที่ Need ≤ Work ได้ (เกิด Deadlock)
                            </li>
                        )}
                    </ul>
                </div>

                {/* --- SECTION 4: SAFE SEQUENCE --- */}
                {/* FRONTEND TEAM:
                   - แสดงลำดับ Safe Sequence จากตัวแปร {sequence}
                   - ถ้า isSafe เป็น false ให้ซ่อน หรือขึ้นข้อความว่า "No Safe Sequence"
                */}
                <div className="sequence-container" style={{ marginTop: '30px', textAlign: 'left' }}>
                    <h3>Safe Sequence</h3>
                    <div style={{ 
                        padding: '15px', 
                        background: isSafe ? '#d1fae5' : '#fee2e2', 
                        borderRadius: '8px',
                        border: `1px solid ${isSafe ? '#1E8E70' : '#991b1b'}`,
                        color: isSafe ? '#065f46' : '#991b1b',
                        fontWeight: '500'
                    }}>
                        {isSafe 
                            ? sequence.join(' → ') // แสดง P1 -> P2 -> ...
                            : "ไม่มี Safe Sequence (ระบบไม่ปลอดภัย)"
                        }
                    </div>
                </div>

                {/* ปุ่มกดกลับ หรือ Restart */}
                <div className="navigation-buttons-in-card">
                    <button className="back-button" onClick={() => navigate(-1)}>Back</button>
                    <button className="next-button" onClick={() => navigate('/')}>Restart</button>
                </div>

            </div>
        </div>
    );
}

export default ResultPage;