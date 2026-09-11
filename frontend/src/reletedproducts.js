import { API_BASE_URL } from "./api";
import { useCallback, useState, useEffect, useContext, useRef } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import Swal from "sweetalert2"
import { Context } from "./usecontext"
import { getImageUrl } from "./imageUrl"
import headphone from "./images/electroimage.jpg";


export const Related = () => {
    const [pricesort, setpricesort] = useState("")
    const [brandSort, setbrandSort] = useState("")
    const [d, setd] = useState([])
    const [datta, setdatta] = useState([])
    const { id } = useContext(Context)
    const [pr] = useSearchParams()
    const navigate = useNavigate()
    const prr = pr.get("id")
    const loadedCategory = useRef("");

    const show = useCallback(async (id) => {
        const result = await fetch(`${API_BASE_URL}/api/related/${id}`, {
            method: "get"
        })
        if (result.ok) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setd(res.data)
                console.log(res.data)
            }
            else {
                alert("error")
            }
        }
    }, [])

    const show2 = useCallback(async () => {
        const result = await fetch(`${API_BASE_URL}/api/getbrand/${prr}`, {
            method: "get"
        })
        if (result) {
            const res = await result.json()
            if (res.statuscode === 1) {
                setdatta(res.data)
            }
            else {
                alert("not")
            }
        }
    }, [prr])

    useEffect(() => {
        if (!prr || loadedCategory.current === prr) {
            return;
        }
        loadedCategory.current = prr;
        show(prr);
        show2();
    }, [prr, show, show2]);

    const wish = async (id, name, price, img, prr) => {
        if (!prr || !id) return;
        const data = { id, name, price, img }
        const result = await fetch(`${API_BASE_URL}/api/wishpost/${prr}`, {
            method: "post",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json;charset=UTF-8" }
        })
        if (result.ok) {
            const res = await result.json();

            if (res.statuscode === 2) {
                Swal.fire({
                    icon: "info",
                    title: "❤️ Already in Wishlist",
                    text: (res.message)
                })
            }

            else if (res.statuscode === 1) {
                navigate(`/wish?id=${id}`);
                Swal.fire({
                    icon: "success",
                    title: "❤️ Added in Wishlist",
                })
            }

            else {
                alert("Something went wrong");
            }

        }
    }
    const products = [...d]
        .filter((p) => {
            if (!brandSort) return true
            return p.Brand === brandSort
        })
        .sort((a, b) => {
            if (pricesort === "low") {
                return a.ProductPrice - b.ProductPrice
            }
            if (pricesort === "high") {
                return b.ProductPrice - a.ProductPrice
            }
            return 0
        })
    useEffect(() => {
        const timer = setTimeout(() => {
            const slider = document.querySelector(".brandSlider");
            if (slider && !slider.classList.contains("is-initialized")) {
                new window.Splide(slider, {
                    perPage: 6,
                    gap: 20,
                    autoplay: true,
                    arrows: false,
                    pagination: false,
                    breakpoints: {
                        992: { perPage: 4, arrows: true },
                        768: { perPage: 3, arrows: true },
                        576: { perPage: 2, arrows: true },
                    },
                }).mount();
            }
        }, 300);

        return () => clearTimeout(timer);
    }, []);


    const cart = async (id, name, price, img, value = 1, prr) => {
        if (!prr || !id) return;
        const data = { id, name, price, img, value }
        const result = await fetch(`${API_BASE_URL}/api/cartdata/${prr}`, {
            method: "post",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json;charset=UTF-8" }
        })
        if (result.ok) {
            const res = await result.json()
            if (res.statuscode === 2) {
                Swal.fire({
                    icon: "info",
                    title: "🛒 Already in Cart",
                    text: (res.message)
                });

            }
            else if (res.statuscode === 1) {
                navigate(`/cart?id=${id}`)
                Swal.fire({
                    icon: "success",
                    text: "🛒 Added to Cart"
                })
            }
            else {
                alert("Something Error")
            }
        }

    }

    return (
        <>
            <section className="s-page-title d-flex align-items-center justify-content-center text-center">
                <div className="container-fluid bread">
                    <img src={headphone} alt="Headphones" height="400" width="100%"></img> 
                    <div className="content" background="red">
                        
                        <ul className="breadcrumbs-page list-unstyled d-flex justify-content-center align-items-center gap-2 py-3">
                            <li>
                                <Link to="/" className="h6 link text-decoration-none">Home</Link>
                            </li>

                            <li>
                                <span>{""}</span>
                            </li>

                            <li>
                                <span className="current-page fw-normal mb-0">Related Products</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <section>
                <div className="container mt-5">

                    <h1 className="text-center">SHOP BY BRAND</h1>

                    <div className="splide brandSlider mt-4">
                        <div className="splide__track">

                            <ul className="splide__list">

                                {datta.map((a, i) => (
                                    <li className="splide__slide text-center" key={i}>

                                        <Link
                                            className="text-decoration-none text-black d-block"
                                            to={`/brand?id=${a._id}`}
                                        >

                                            <img
                                                src={getImageUrl(a.Img)}
                                                className="object-fit-cover rounded mx-auto"
                                                style={{ width: "100px", height: "100px" }}
                                                alt=""
                                            />

                                            <h6 className="mt-2">{a.BrandName}</h6>

                                        </Link>

                                    </li>
                                ))}

                            </ul>

                        </div>
                    </div>

                </div>
            </section>


            <div className="container mt-5">

                <div className="d-flex justify-content-between align-items-center d-lg-block">
                    <div><h2 className="fw-bold text-start text-lg-center">Our Collection</h2></div>
                    <div>
                        <button
                            className="btn  d-lg-none"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasRight"
                        ><i className="fa-duotone fa-solid fa-sliders"></i>
                            Filters
                        </button>
                    </div>
                </div>



                <div className="row mt-4 g-4 justify-content-center">
                    <div className="col-lg-3 d-none d-md-block">
                        <h2 className="text-center">Filters</h2>
                        <select className="form-select  mt-5 " aria-label="Default select example" onChange={(e) => setpricesort(e.target.value)}>
                            <option value="">Select Price</option>
                            <option value="low">Low to High</option>
                            <option value="high">High to Low</option>
                        </select>
                        <select className="form-select  mt-4 " aria-label="Default select example" onChange={(e) => setbrandSort(e.target.value)}>
                            <option value="">Select Brand</option>
                            {datta.map((a) => (
                                <option key={a._id} value={a._id}>{a.BrandName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col">
                        <div className="row">
                            {products.map((b) => (
                                <div key={b._id} className="col-lg-3 col-md-4 col-6 ">

                                    <Link className="text-decoration-none text-black" to={`/detail?id=${b._id}&cid=${prr}`}>

                                        <div className="card border-0 shadow-sm text-center p-3 w-100">
                                            <div className='cardicons justify-self-end'>

                                                <p className='text-danger btn' onClick={() => { wish(id, b.ProductName, b.ProductPrice, b.Img, b._id) }}><i className="bi bi-heart-fill"></i>
                                                </p><br></br>
                                                <p className="btn" onClick={() => { cart(id, b.ProductName, b.ProductPrice, b.Img, b.Quantity, b._id) }}><i className="bi bi-cart"></i></p>
                                                <p><i className="bi bi-eye"></i></p>
                                            </div>

                                            <div className="d-flex justify-content-center align-items-center mb-3" style={{ height: "150px" }}>
                                                <img
                                                    src={getImageUrl(b.Img)}
                                                    alt={b.ProductName}
                                                    className="img-fluid"
                                                    style={{ maxHeight: "120px" }}
                                                />
                                            </div>

                                            <div className="card-body p-0">
                                                <h6 className="fw-semibold mb-2">{b.ProductName}</h6>
                                                <div className="mb-2 text-warning">
                                                    <i className="bi bi-star-fill"></i>
                                                    <i className="bi bi-star-fill"></i>
                                                    <i className="bi bi-star-fill"></i>
                                                    <i className="bi bi-star-half"></i>
                                                    <i className="bi bi-star"></i>
                                                    <span className="text-muted small ms-1">(4.3)</span>
                                                </div>

                                                <p className="d-flex justify-content-center align-self-center text-center">
                                                    <span className=" ">
                                                        ₹{b.ProductPrice}
                                                    </span>
                                                    <span className=" text-success fw-bold ms-1 ">
                                                        ₹{b.SalePrice}
                                                    </span>


                                                </p>

                                                <button className="btn btn-primary btn-sm w-75">
                                                    View Product
                                                </button>
                                            </div>

                                        </div>

                                    </Link>

                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>

            <div className="offcanvas offcanvas-start" id="offcanvasRight">

                <div className="offcanvas-header">
                    <h5>Filters</h5>
                    <button className="btn-close" data-bs-dismiss="offcanvas"></button>
                </div>

                <div className="offcanvas-body">

                    <h5 className="fw-bold">Price</h5>

                    <ul className="list-group">

                        <li className="list-group-item border-0">
                            <button
                                className="btn w-100 text-start"
                                data-bs-dismiss="offcanvas"
                                onClick={() => setpricesort("low")}
                            >
                                ⬇ Low to High
                            </button>
                        </li>

                        <li className="list-group-item border-0">
                            <button
                                className="btn w-100 text-start"
                                data-bs-dismiss="offcanvas"
                                onClick={() => setpricesort("high")}
                            >
                                ⬆ High to Low
                            </button>
                        </li>

                    </ul>
                    <h5 className="fw-bold mt-4">Brand</h5>
                    <div className="">
                        <ul className="list-group mt-3 border-none list-unstyled text-start">
                            {datta.map((a) => (
                                <li
                                    key={a._id}
                                    className="ms-4 mt-3"
                                    data-bs-dismiss="offcanvas"
                                    onClick={() => setbrandSort(a._id)}
                                >
                                    {a.BrandName}
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

            </div>

            <section className="container mt-2 py-4">
                <h2 className="fw-bold text-center mb-4">Why Choose Us</h2>
                <div className="row g-4 py-5">
                    <div className="col-md-3 col-6 text-center">
                        <i className="bi bi-truck fs-1 text-primary"></i>
                        <h6 className="mt-2">Free Shipping</h6>
                        <small className="text-muted">On orders above ₹999</small>
                    </div>
                    <div className="col-md-3 col-6 text-center">
                        <i className="bi bi-shield-check fs-1 text-success"></i>
                        <h6 className="mt-2">Secure Payment</h6>
                        <small className="text-muted">100% secure transactions</small>
                    </div>
                    <div className="col-md-3 col-6 text-center">
                        <i className="bi bi-arrow-repeat fs-1 text-warning"></i>
                        <h6 className="mt-2">Easy Returns</h6>
                        <small className="text-muted">7 days return policy</small>
                    </div>
                    <div className="col-md-3 col-6 text-center">
                        <i className="bi bi-headset fs-1 text-info"></i>
                        <h6 className="mt-2">24/7 Support</h6>
                        <small className="text-muted">Dedicated customer support</small>
                    </div>
                </div>
            </section>


        </>
    )
}
