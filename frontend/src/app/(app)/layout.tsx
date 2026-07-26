import { ReactNode } from "react"

import DesktopNav from "@/components/DesktopNav"

type Props = {
    children: ReactNode
}

const layout = (props: Props) => {
    return (
        <>
            <DesktopNav />
            {props.children}
        </>
    )
}

export default layout
