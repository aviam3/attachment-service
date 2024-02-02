import { AwsStorage } from "./awsStorage"

const storageFactory = {

    createStorage: (vendorId: string) => {
        if (vendorId === "aws")
            return new AwsStorage()
        //TODO
        // if (vendorId === "mongo")
        //     return new MongoStorage()
        return new AwsStorage()
    }
}

export default storageFactory
