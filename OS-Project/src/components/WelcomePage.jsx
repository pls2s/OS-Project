// import { useNavigate } from "react-router-dom"
import "./WelcomePage.css"
function WelcomePage() {
    // const navigate = useNavigate()

    // function handelWelcome() {
    //     navigate("/")
    // }
    return( 
    <div className="cont">
        <main class="wrap">
            <section class="card" aria-label="Intro">
                <h1>Banker’s Algorithm</h1>
                <span class="divider" aria-hidden="true"></span>
                <p>
                    Banker’s Algorithm is a resource allocation and deadlock avoidance algorithm used in operating systems. It 
                    ensures that a system remains in a safe state by carefully allocating resources to processes while avoiding 
                    unsafe states that could lead to deadlocks.
                </p>
                <button class="btn" type="button">Let's go</button>
            </section>
        </main>
    </div>
    )

}
export default WelcomePage