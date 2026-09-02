export async function healthStatus(req, res, next) {
    try {
        res.status(200).json({ status: "servidor andando" });
    } catch (error) {
        console.log(error);
    }
}