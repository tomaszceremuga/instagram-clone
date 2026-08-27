import { FadeLoader } from "react-spinners"

const Loading = () => {
    return (
        <div className="w-screen h-screen flex relative items-center justify-center">
            <div className="pl-10">
                <FadeLoader
                    color="#707070"
                    height={7}
                    margin={-10}
                    radius={8}
                    width={2}
                    cssOverride={{ transform: "translate(4px, 3px)" }}
                />
            </div>
        </div>
    )
}

export default Loading
