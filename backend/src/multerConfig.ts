import crypto from "crypto"
import path from "path"
import multer from "multer"

const createUploader = (folderName: string, allowedTypes: string[]) => {
    const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, path.join(__dirname, "..", "uploads", folderName))
        },
        filename: (req, file, callback) => {
            const uniqueName = crypto.randomUUID() + path.extname(file.originalname)
            callback(null, uniqueName)
        },
    })

    const fileFilter: multer.Options["fileFilter"] = (req, file, callback) => {
        if (allowedTypes.includes(file.mimetype)) {
            callback(null, true)
        } else {
            callback(null, false)
        }
    }

    return multer({ storage, fileFilter })
}

export const uploadAvatar = createUploader("avatars", ["image/png", "image/jpeg"])

export const uploadPost = createUploader("posts", ["image/png", "image/jpeg", "video/mp4"])
