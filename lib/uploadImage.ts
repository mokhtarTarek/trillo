import { storage } from "@/appwrite";
import { ID, Storage } from "appwrite";

const uploadImage = async (file: File) => {
    if (!file) return
    const fileUploaded = await storage.createFile(
        // provide the bucketId from upwrite and a unique Id and the file itself
        '64f5d33c057b96c61473',
        ID.unique(),
        file
    )
    return fileUploaded

}
export default uploadImage