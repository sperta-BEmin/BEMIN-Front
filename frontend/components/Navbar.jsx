import Link from 'next/link';
import React from 'react';

const Navbar = ({ children }) => {
    return (
        <nav className="navbar navbar-expand-lg shadow bg-body-tertiary mb-5">
            <div className="container-fluid">
                <Link className="navbar-brand" href="/">
                    BE민
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link href="/order" className="nav-link active" aria-current="page">
                                Order테스트
                            </Link>
                        </li>
                        {/*<li className="nav-item">*/}
                        {/*    <Link href="/2" className="nav-link" aria-current="page">*/}
                        {/*        2*/}
                        {/*    </Link>*/}
                        {/*</li>*/}
                        {/*<li className="nav-item dropdown">*/}
                        {/*    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"*/}
                        {/*       aria-expanded="false">*/}
                        {/*        Dropdown*/}
                        {/*    </a>*/}
                        {/*    <ul className="dropdown-menu">*/}
                        {/*        <li><a className="dropdown-item" href="#">Action</a></li>*/}
                        {/*        <li><a className="dropdown-item" href="#">Another action</a></li>*/}
                        {/*        <li>*/}
                        {/*            <hr className="dropdown-divider"/>*/}
                        {/*        </li>*/}
                        {/*        <li><a className="dropdown-item" href="#">Something else here</a></li>*/}
                        {/*    </ul>*/}
                        {/*</li>*/}
                        <li className="nav-item">
                            <a className="nav-link disabled" aria-disabled="true">Disabled</a>
                        </li>
                    </ul>
                    <div className="d-flex ms-auto">
                        <Link href="/login" className="btn btn-outline-primary me-2">
                            로그인
                        </Link>
                        <Link href="/signup" className="btn btn-primary">
                            회원가입
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;