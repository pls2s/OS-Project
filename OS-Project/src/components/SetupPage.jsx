import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SetupPage() {
    const [numProcesses, setNumProcesses] = useState(0);
    const [numResources, setNumResources] = useState(0);
    
    const [error, setError] = useState(null); 
    
    const navigate = useNavigate();

    const handleProcessChange = (amount) => {
        setNumProcesses(prev => Math.max(0, prev + amount));
        if (error) setError(null);
    };

    const handleResourceChange = (amount) => {
        setNumResources(prev => Math.max(0, prev + amount));
        if (error) setError(null);
    };

    const handleInputChange = (event, setter) => {
        const value = event.target.value.replace(/[^0-9]/g, '');
        
        setter(value === '' ? 0 : Number(value));
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

        setError(null);
        console.log("State_Processes:", numProcesses);
        console.log("State_Resources:", numResources);
        
        alert(`Processes: ${numProcesses}, Resources: ${numResources}. รอกูก่ออน! กูยังไม่ได้สร้าง แต่กรอกถูกละ`)
    };

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>ขั้นตอนที่ 1 — กรอกข้อมูล Process และ Resource Type สู้ๆนะคับพีระพอร์ช เขียนถูกไหมไม่รู้</h2>
            
            {error && (
                <div style={{ color: 'red', border: '1px solid red', padding: '10px', margin: '1rem auto', maxWidth: '400px' }}>
                    {error}
                </div>
            )}

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