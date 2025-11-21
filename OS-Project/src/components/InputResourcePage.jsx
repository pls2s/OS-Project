// ไฟล์: InputResourcePage.jsx


import './InputResourcePage.css';

function InputResourcePage() {
    return (
        <div className="setup-container">
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
            {/* เนื้อหาหน้า Input Resource Page */}

        </div>
    );
}

export default InputResourcePage;