import { Search } from "lucide-react"

type Props = {
    value: string
    setValue: React.Dispatch<React.SetStateAction<string>>
}

const SearchInput = (props: Props) => {
    return (
        <div className="w-full flex h-9 px-2 rounded-lg bg-gray-200">
            <label htmlFor="search-input">
                <Search className="size-9 p-2 cursor-text text-gray-500" />
            </label>
            <input
                id="search-input"
                placeholder="Search..."
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
                autoComplete="off"
                className="w-full h-9 outline-none focus:outline-none focus:ring-0 focus:border-transparent"
                value={props.value}
                onChange={(e) => props.setValue(e.target.value)}
            />
            <svg
                onClick={() => props.setValue("")}
                aria-label="Clear"
                className="size-9 p-2.5 cursor-pointer"
                fill="currentColor"
                height="14"
                role="img"
                viewBox="0 0 24 24"
                width="14">
                <title>Clear</title>
                <path d="M12.001.504c-6.34 0-11.5 5.16-11.5 11.5s5.16 11.5 11.5 11.5 11.5-5.158 11.5-11.5-5.16-11.5-11.5-11.5Zm4.707 14.793a1 1 0 1 1-1.414 1.414l-3.293-3.293-3.293 3.293a.997.997 0 0 1-1.414 0 1 1 0 0 1 0-1.414l3.293-3.293-3.293-3.293a1 1 0 1 1 1.414-1.414l3.293 3.293 3.293-3.293a1 1 0 1 1 1.414 1.414l-3.293 3.293 3.293 3.293Z"></path>
            </svg>
        </div>
    )
}

export default SearchInput
