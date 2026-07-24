type Props = {
    className?: string
}

const PostsGrid = (props: Props) => {
    return (
        <div className={"grid grid-cols-3 gap-0.5 lg:grid-cols-5" + " " + props.className}>
            {Array.from({ length: 15 }).map((_, index) => (
                <div key={index}>
                    <img
                        src={`https://picsum.photos/id/${Math.floor(Math.random() * 500) + 1}/300/400`}
                        alt=""
                    />
                </div>
            ))}
        </div>
    )
}

export default PostsGrid
