import Link from "next/link"

const PostIsPrivate = () => {
    return (
        <div className="w-screen h-screen flex flex-col justify-center text-center items-center p-10  ">
            <h1 className="text-xl font-semibold mb-5">This post is private.</h1>
            <p className="md:max-w-2/3">
                Follow creator to se the post.{" "}
                <Link className="text-blue-600 hover:underline cursor-pointer" href={"/"}>
                    Go back to Instagram.
                </Link>
            </p>
        </div>
    )
}

export default PostIsPrivate
