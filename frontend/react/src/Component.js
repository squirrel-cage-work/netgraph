import React, { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

import TitleHeader from "./components/TitleHeader";
import Interface from "./components/Interface";

function Component() {

    //クエリパラメータの解析
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const deviceName = searchParams.get('deviceName');
    const deviceType = searchParams.get('deviceType');

    return (
        <div className="flex flex-col px-4">
            <div>
                <TitleHeader title={deviceName}/>
            </div>
            <div>
                <main>
                    <Interface deviceType={deviceType}/>
                </main>
            </div>
        </div>
    );

}

export default Component;