
import { useState, useEffect, useContext } from "react"
import { Context } from "./usecontext"
import { getImageUrl } from "./imageUrl"
import { Chart as ChartJs, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from "chart.js"
import { Bar, Pie, Line } from 'react-chartjs-2'

ChartJs.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    ArcElement,
    PointElement,
    Tooltip,
    Legend,
    Title

);


export const VendorDashboard = () => {

    const [d,setd]=useState([])
    const {id}=useContext(Context)

    const [monthlyData, setMonthlyData] = useState({
            labels: [],
            datasets: []
        });

    useEffect(()=>{
        if(id){
            show()
        show2()
        }
    
    },[id])


    const show=async()=>{
        const result=await fetch(`http://localhost:8000/api/vendorproduct/${id}`,{
            method:"get"
        })
        if(result.ok){
            const res=await result.json()
            if(res.statuscode===1){
                setd(res.data)
            }
        }
    }

   const show2 = async () => {
    try {
        const result = await fetch(`http://localhost:8000/api/vendorrevenue/${id}`, {
            method: "get"
        });

        if (!result.ok) {
            console.error("API error");
            return;
        }

        const res = await result.json();

        if (res.statuscode === 1) {
            setMonthlyData({
                labels: res.labels || [],
                datasets: [
                    {
                        label: "Monthly Sales",
                        data: res.values || [],
                        borderColor: "green",
                        backgroundColor: "rgba(0,128,0,0.2)", // better UI
                        tension: 0.3,
                        fill: true
                    }

                ]
            });
           
        }
    } catch (err) {
        console.error("Fetch failed:", err);
    }
};

    return(
        <>
      <div className="py-5">
          <h1 className="" >Vendor Dashboard</h1>
        <p>Welcome to your dashboard, where you can manage your products and view sales data.</p>
      </div>
       
            <div className="container my-5">
                <div className="row">
                  
                        {
                            d.map((a)=>(
                                  <div className="col-lg-4 d-flex col-md-6 col-6">
                                 <div className="card w-100 border-0 shadow-sm text-center p-3">
                            <div className=" rounded d-flex justify-content-center align-items-center mb-3" style={{ height: "150px" }}>
                                <img
                                    src={getImageUrl(a.Img)}
                                    alt={a.name}
                                    className="img-fluid"
                                    style={{ maxHeight: "120px" }}
                                />
                            </div>

                            <div className="card-body p-0">
                                <h6 className="fw-semibold mb-2">{a.ProductName}</h6>
                                <p className="mb-2 text-muted">Price: {a.ProductPrice}</p>
                                <p className="mb-2 text-muted">Sale: {a.SalePrice}</p>
                            </div>
                        </div>  
                        </div>
                            ))
                        }
                               
               

            </div>
            </div>
            <div className="border" style={{ marginTop: "100px" }}>
                            <h1 className="mt-2">Sales</h1>
                            <div className="mt-3">
                                <Line data={monthlyData} />
                            </div>
                            </div>
     
        </>
    )
}