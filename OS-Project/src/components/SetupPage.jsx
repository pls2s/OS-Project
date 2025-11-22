import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SetupPage.css';
function SetupPage() {
    const [numProcesses, setNumProcesses] = useState(0);
    const [numResources, setNumResources] = useState(0);
    
    const [error, setError] = useState(null); 
    
    const navigate = useNavigate();

    const handleProcessChange = (amount) => {
        setNumProcesses(prev => Math.min(10, Math.max(0, prev + amount)));
        if (error) setError(null);
    };

    const handleResourceChange = (amount) => {
        setNumResources(prev => Math.min(10, Math.max(0, prev + amount)));
        if (error) setError(null);
    };

    const handleBack = () => {
        navigate("/");
    };

    const handleNext = () => {
        if (numProcesses === 0 || numResources === 0) {
            setError("จะไปไหน! กรอกให้ครบ สิไอ้....!");
            return;
        }
        navigate("/inputResc", { 
            state: { 
                numP: numProcesses, 
                numR: numResources 
            } 
        });

        setError(null);
        console.log("State_Processes:", numProcesses);
        console.log("State_Resources:", numResources);
    };
    return (
        <div className="setup-container">
            <div className="stepper-bar">
                <div className="step-item is-active">
                    <div className="step-circle">1</div>
                    <div className="step-text">step 1</div>
                </div>
                <div className="step-line"></div>
                <div className="step-item">
                    <div className="step-circle">2</div>
                    <div className="step-text">step 2</div>
                </div>
                <div className="step-line"></div>
                <div className="step-item">
                    <div className="step-circle">3</div>
                    <div className="step-text">step 3</div>
                </div>
            </div>

            <h2 className="main-title">ขั้นตอนที่ 1 — กรอกข้อมูล Process และ Resource Type</h2>
            <p className="subtitle">ค่าที่กรอกจะถูกใช้สร้างตาราง Allocation / Max / Available อัตโนมัติในขั้นต่อไป</p>
            
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* START: Combined Input Card */}
            <div className="main-input-card">
                <div className="input-content-wrapper">
                    <div className="input-section">
                        <label className="input-label">Number of Processes</label>
                        <div className="input-group">
                            <button className="input-button" onClick={() => handleProcessChange(-1)}>-</button>
                            <input 
                                type="text" 
                                value={numProcesses} 
                                onChange={(e) => handleInputChange(e, setNumProcesses)}
                                className="input-field"
                            />
                            <button className="input-button" onClick={() => handleProcessChange(1)}>+</button>
                        </div>
                        <p className="input-hint">จำนวน Process ที่จะจำลอง (n) เช่น 3</p>
                    </div>

                    <div className="input-section">
                        <label className="input-label">Number of Resource Type</label>
                        <div className="input-group">
                            <button className="input-button" onClick={() => handleResourceChange(-1)}>-</button>
                            <input 
                                type="text" 
                                value={numResources} 
                                onChange={(e) => handleInputChange(e, setNumResources)}
                                className="input-field" 
                            />
                            <button className="input-button" onClick={() => handleResourceChange(1)}>+</button>
                        </div>
                        <p className="input-hint">จำนวน Resource types เช่น 3</p>
                    </div>
                </div>
                
                <div className="navigation-buttons-in-card">
                    <button onClick={handleBack} className="back-button">
                        Back
                    </button>

                    <button onClick={handleNext} className="next-button">
                        Next
                    </button>
                </div>
                
            </div>
            {/* END: Combined Input Card */}
        </div>
    );
}

export default SetupPage;