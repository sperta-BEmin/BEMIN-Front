import Link from 'next/link';
import React from 'react';

export default function Owner() {
    const btnClassName = "btn w-100 mb-3 "

    return (
        <div className="container-sm">
            <div className="row justify-content-center">
                <div className="col-md-4 p-3">
                    <div className="card">
                        <img
                            src="/assets/logos/bemin_logo.png"
                            alt="bemin logos" width="80"
                            className="card-img-top"
                        />
                        <div className="card-body">
                            <h5 className="card-title text-center">
                                점주 시스템
                            </h5>
                            <Link href="/owner/mystore" className={btnClassName + "btn-info"}>
                                가게 관리
                            </Link>
                            <Link href="/owner/menu" className={btnClassName + "btn-info"}>
                                메뉴 관리
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}