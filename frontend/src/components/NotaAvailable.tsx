import Link from "next/link"

const NotaAvailable = () => {
    return (
        <div className="w-screen h-screen flex flex-col justify-center text-center items-center p-25">
            <h1 className="text-xl font-semibold mb-5">Sorry, this page isn't available.</h1>
            <p>
                The link you followed may be broken, or the page may have been removed.{" "}
                <Link className="text-blue-600 hover:underline cursor-pointer" href={"/"}>
                    Go back to Instagram.
                </Link>
            </p>
        </div>
    )
}

export default NotaAvailable
