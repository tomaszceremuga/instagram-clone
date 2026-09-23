type Props = {
    text: string
    maxLength: number
}

const TextMaxLength = (props: Props) => {
    const newText =
        props.text.length > props.maxLength
            ? props.text.slice(0, props.maxLength) + "..."
            : props.text

    return <span>{newText}</span>
}

export default TextMaxLength
