// ไฟล์: InputResourcePage.jsx


import { useNavigate, useLocation } from 'react-router-dom'; // ✅ Import useLocation
import './InputResourcePage.css'; // ใช้ CSS เดียวกันเพื่อความเรียบร้อย

function InputResourcePage() {
    // ✅ ดึงค่าที่ส่งมาจากหน้า SetupPage
    const location = useLocation();
    const navigate = useNavigate();
    
    // กำหนดค่าเริ่มต้นเป็น 3x3 หากไม่มีค่าส่งมา (เพื่อป้องกัน error)
    const numP = location.state?.numP || 3; 
    const numR = location.state?.numR || 3;
    
    // สร้าง Array สำหรับชื่อ Resource Type (A, B, C, ...)
    const resourceHeaders = Array.from({ length: numR }, (_, i) => String.fromCharCode(65 + i));
    // สร้าง Array สำหรับชื่อ Process (P1, P2, P3, ...)
    const processRows = Array.from({ length: numP }, (_, i) => `P${i + 1}`);

    // ฟังก์ชันสร้างตาราง (Allocation หรือ Max)
    const generateTable = (title) => (
        <div className="table-container">
            <h3>{title}</h3>
            <div className="resource-table">
                <table>
                    <thead>
                        <tr>
                            <th>Process</th>
                            {resourceHeaders.map(header => (
                                <th key={header}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {processRows.map(process => (
                            <tr key={process}>
                                <td>{process}</td>
                                {resourceHeaders.map(header => (
                                    <td key={header}>
                                        <input type="text" className="table-input" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <a href="#" className="reset-link">Reset Table</a>
        </div>
    );

    // ฟังก์ชันสร้างตาราง Available (ไม่มี Process Column)
    const generateAvailableTable = () => (
        <div className="table-container">
            <h3>3) กรอกข้อมูล Available</h3>
            <div className="resource-table available-table">
                <table>
                    <thead>
                        <tr>
                            {resourceHeaders.map(header => (
                                <th key={header}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {resourceHeaders.map(header => (
                                <td key={header}>
                                    <input type="text" className="table-input" />
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
            <a href="#" className="reset-link">Reset Table</a>
        </div>
    );
    
    const handleBack = () => {
        navigate("/setup"); // กลับไปหน้า SetupPage
    };
    
    const handleNext = () => {
        // ... (Logic ตรวจสอบข้อมูลในตาราง และไปยัง Step 3)
        alert('Data input complete. Moving to Step 3 (Calculation)');
    };


    return (
        
        <div className="setup-container">
            {/* Stepper Bar (Step 2 Active) */}
            <div className="stepper-bar">
                <div className="step-item is-active">
                    <div className="step-circle">1</div>
                    <div className="step-text">step 1</div>
                </div>
                <div className="step-line is-active"></div>
                <div className="step-item is-active">
                    <div className="step-circle">2</div>
                    <div className="step-text">step 2</div>
                </div>
                <div className="step-line"></div>
                <div className="step-item">
                    <div className="step-circle">3</div>
                    <div className="step-text">step 3</div>
                </div>
            </div>

            <h2 className="main-title">ขั้นตอนที่ 2 — กรอกข้อมูล Allocation, Max และ Available</h2>
            <p className="subtitle">ระบุขนาดคอลัมน์ตามจำนวน Resource types ({numR}) และแถวตามจำนวน Process ({numP}) ที่กรอกไว้ในขั้นตอนก่อนหน้า</p>
            
            {/* START: Main Input Card */}
            <div className="main-input-card">
                
                {/* 1. ตาราง Allocation */}
                {generateTable("1) กรอกข้อมูล Allocation")}

                {/* 2. ตาราง Max */}
                {/* Note: ในภาพของคุณมี '2) กรอกข้อมูล Max' และ '2) กรอกข้อมูล Available' 
                   ผมเปลี่ยน Available เป็น '3)' เพื่อความถูกต้องตามหลักการ Banker's Algorithm */}
                {generateTable("2) กรอกข้อมูล Max")}
                
                {/* 3. ตาราง Available */}
                {generateAvailableTable()}

                <div className="navigation-buttons-in-card">
                    <button onClick={handleBack} className="back-button">
                        Back
                    </button>
                    <button onClick={handleNext} className="next-button">
                        Next
                    </button>
                </div>
            </div>
            {/* END: Main Input Card */}
        </div>
    );
}

export default InputResourcePage;