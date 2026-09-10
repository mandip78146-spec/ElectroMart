import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { Context } from "./usecontext"

export const VendorLogin = () => {

    const [email, setemail] = useState("")
    const [pass, setpass] = useState("")
    const { setid, setutype } = useContext(Context)
    const navigate = useNavigate()

    const login = async (e) => {
        e.preventDefault()
        const result = await fetch("http://localhost:8000/api/vlog", {
            method: "post",
            body: JSON.stringify({ email, pass }),
            headers: { "Content-type": "application/json;charset=UTF-8" }
        })
        const res = await result.json()

        if (result.ok && res.statuscode === 1) {
            localStorage.setItem("data", JSON.stringify(res.token))
            setutype(res.userType || "Vendor")
            setid(res.data?._id || "")
            Swal.fire({ icon: "success", title: "Vendor login successful" })
            navigate("/vendordash")
            return;
        }

        Swal.fire({ icon: "error", title: "Login failed", text: res.message || "Invalid vendor credentials" })
    }


    return (
        <>
            <h1 className="mt-5">Vendor Login</h1>
            <p className="lead">Welcome back! Please login to your account.</p>
            <form onSubmit={login}>
                <div className="container">
                    <div className="row py-5">
                        <div className="col col-lg-6">
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label" >Email</label>
                                <input type="email" className="form-control rounded-pill" id="email" onChange={(e) => setemail(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input type="password" className="form-control rounded-pill" id="password" onChange={(e) => setpass(e.target.value)} />
                            </div>
                            <button type="submit" className="btn btn-primary w-25">Login</button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}