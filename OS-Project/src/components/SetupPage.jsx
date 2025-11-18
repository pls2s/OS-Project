import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * SetupPage Component
 * หน้าแรกสำหรับกำหนดค่าเริ่มต้น (จำนวน Process และ Resource)
 * ก่อนเข้าสู่การจำลอง Banker's Algorithm
 */
function SetupPage() {
    const [numProcesses, setNumProcesses] = useState(0); // จำนวน Process
    const [numResources, setNumResources] = useState(0); // จำนวน Resource Type
    const [error, setError] = useState(null); // เก็บข้อความ Error (ถ้ามี)

    // Hook สำหรับเปลี่ยนหน้า
    const navigate = useNavigate();

    /**
     * เพิ่ม/ลด จำนวน Process ผ่านปุ่ม +/-
     * @param {number} amount - จำนวนที่ต้องการบวกหรือลบ (เช่น 1 หรือ -1)
     */
    const handleProcessChange = (amount) => {
        // Math.max(0, ...) ป้องกันไม่ให้ค่าติดลบ
        setNumProcesses(prev => Math.max(0, prev + amount));
        if (error) setError(null); // เคลียร์ error เมื่อมีการแก้ไขค่า
    };

    /**
     * เพิ่ม/ลด จำนวน Resource ผ่านปุ่ม +/-
     */
    const handleResourceChange = (amount) => {
        setNumResources(prev => Math.max(0, prev + amount));
        if (error) setError(null);
    };

    /**
     * จัดการเมื่อผู้ใช้พิมพ์ตัวเลขลงใน Input โดยตรง
     * @param {object} event - event จาก input
     * @param {function} setter - function setState ที่ต้องการอัปเดต (setNumProcesses หรือ setNumResources)
     */
    const handleInputChange = (event, setter) => {
        // ลบตัวอักษรที่ไม่ใช่ตัวเลขออกให้หมด
        const value = event.target.value.replace(/[^0-9]/g, '');
        
        setter(value === '' ? 0 : Number(value));
        if (error) setError(null);
    };

    const handleBack = () => {
        navigate("/"); // กลับหน้า Home
    };

    /**
     * ตรวจสอบความถูกต้อง (Validation) และไปหน้าถัดไป
     */
    const handleNext = () => {
        if (numProcesses === 0 || numResources === 0) {
            setError("จะไปไหน! กรอกให้ครบ สิไอ้....!"); // Error message แบบกันเองสุดๆ
            return;
        }

        setError(null);
        
        // Debugging: เช็คค่าก่อนส่ง
        console.log("State_Processes:", numProcesses);
        console.log("State_Resources:", numResources);
        
        // ส่งค่า state (numProcesses, numResources) ไปยังหน้าถัดไป
        // 2. ลบ alert ออกเมื่อทำหน้าถัดไปเสร็จ
        alert(`Processes: ${numProcesses}, Resources: ${numResources}. รอกูก่ออน! กูยังไม่ได้สร้าง แต่กรอกถูกละ`)
        
    };
    // ==========================================
    // 3. Render (UI)
    // ==========================================
    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            {/* --- Header --- */}
            <h2>ขั้นตอนที่ 1 — กรอกข้อมูล Process และ Resource Type สู้ๆนะคับพีระพอร์ช เขียนถูกไหมไม่รู้</h2>
            
            {/* --- Error Display Box --- */}
            {error && (
                <div style={{ color: 'red', border: '1px solid red', padding: '10px', margin: '1rem auto', maxWidth: '400px' }}>
                    {error}
                </div>
            )}

            {/* --- Process Input Section --- */}
            <div style={{ margin: '1rem' }}>
                <label>Number of Processes</label>
                <div>
                    <button onClick={() => handleProcessChange(-1)}>-</button>
                    <input 
                        type="text" 
                        value={numProcesses} 
                        onChange={(e) => handleInputChange(e, setNumProcesses)}
                        style={{ margin: '0 10px', textAlign: 'center', width: '50px' }} 
                    />
                    <button onClick={() => handleProcessChange(1)}>+</button>
                </div>
            </div>

            {/* --- Resource Input Section --- */}
            <div style={{ margin: '1rem' }}>
                <label>Number of Resource Type</label>
                <div>
                    <button onClick={() => handleResourceChange(-1)}>-</button>
                    <input 
                        type="text" 
                        value={numResources} 
                        onChange={(e) => handleInputChange(e, setNumResources)}
                        style={{ margin: '0 10px', textAlign: 'center', width: '50px' }} 
                    />
                    <button onClick={() => handleResourceChange(1)}>+</button>
                </div>
            </div>

            {/* --- Action Buttons --- */}
            <div style={{ marginTop: '2rem' }}>
                <button onClick={handleBack} style={{ marginRight: '1rem' }}>
                    Back
                </button>
                <button onClick={handleNext}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default SetupPage;