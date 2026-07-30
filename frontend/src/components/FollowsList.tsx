import { ReactElement } from "react"
import { X } from "lucide-react"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog"

import FollowsListContent from "./FollowsListContent"

type Props = {
    children: ReactElement
    type: "followers" | "following"
    username: string
}

const FollowsList = (props: Props) => {
    return (
        <div>
            <Dialog>
                <DialogTrigger render={props.children} />
                <DialogContent className="sm:max-w-md" showCloseButton={false}>
                    <DialogHeader>
                        <p className="w-full text-center font-semibold text-base border-b p-3  border-gray-300">
                            {props.type === "followers"
                                ? "Followers"
                                : props.type === "following" && "Following"}
                        </p>
                        <DialogClose
                            className={"absolute right-3 top-3"}
                            render={
                                <button className="cursor-pointer">
                                    <X />
                                </button>
                            }
                        />
                    </DialogHeader>
                    <FollowsListContent username={props.username} type={props.type} />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default FollowsList
