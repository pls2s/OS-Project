import { useNavigate } from "react-router-dom"
import "./WelcomePage.css"

function WelcomePage() {
    const navigate = useNavigate()

    function handelWelcome() {
        navigate("/setup")
    }

    return( 
    <div className="cont">
        <main className="wrap">
            <section className="card" aria-label="Intro">
                <h1>Banker’s Algorithm</h1>
                <span className="divider" aria-hidden="true"></span>
                <p>
                    Banker’s Algorithm is a resource allocation and deadlock avoidance algorithm used in operating systems. It 
                    ensures that a system remains in a safe state by carefully allocating resources to processes while avoiding 
                    unsafe states that could lead to deadlocks.
                </p>
                <button className="btn" type="button" onClick={handelWelcome}>Let's go</button>
            </section>
        </main>
    </div>
    )
}

export default WelcomePage